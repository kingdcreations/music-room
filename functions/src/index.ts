import * as admin from "firebase-admin";
import {logger, region} from "firebase-functions";
import {DataSnapshot} from "firebase-admin/database";
import {getFunctions} from "firebase-admin/functions";
import * as ytdl from "ytdl-core";
import * as ffmpeg from "fluent-ffmpeg";

export type Track = {
  key?: string,
  songId: string,
  title: string,
  author: string,
  thumbnailUrl: string,
  vote: number,
  votes: string[],
  startedAt?: number,
}

admin.initializeApp();

const sortSongs = (a: Track, b: Track) => {
  if ((a.votes ? Object.keys(a.votes).length : 0) < (b.votes ? Object.keys(b.votes).length : 0)) {
    return 1;
  } else if ((a.votes ? Object.keys(a.votes).length : 0) > (b.votes ? Object.keys(b.votes).length : 0)) {
    return -1;
  }
  return 0;
};

const loadNextSong = async (roomKey: string) => {
  logger.info("Loading next song...");
  const currentSongRef = admin.database().ref(`/playlists/${roomKey}/currentSong`);
  const queueSongRef = admin.database().ref(`/playlists/${roomKey}/queue`);
  const currentSong = (await currentSongRef.get()).val();

  // Find the most voted song in the queue
  const queueSnapshot = await queueSongRef.get();

  // Check if there is a next song
  if (!queueSnapshot.exists()) {
    logger.info("No song to play next yet");
    return;
  }

  // Parse queue data by adding key to Track object
  const queue = Object.entries<Track>(queueSnapshot.val())
    .map((item) => {
      item[1].key = item[0];
      return item[1];
    });

  // Sort data to get the most voted at top
  const nextSong = queue.length === 1 ? queue[0] : queue.sort(sortSongs)[0];

  // If there is no current song and a next song is available
  if (!currentSong && nextSong && nextSong.key) {
    logger.info(`${nextSong.title} has been loaded`);

    // Remove the next song from the queue
    await admin.database()
      .ref(`/playlists/${roomKey}/queue/${nextSong.key}`).remove();

    logger.info(`NextSong ${nextSong.title} has been removed from ${roomKey} queue`);

    // Get song duration and launch function at the end
    const song = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${nextSong.songId}`);
    const duration = parseInt(song.player_response.videoDetails.lengthSeconds);

    // Save current song data
    nextSong.startedAt = Date.now();
    await currentSongRef.set(nextSong);

    // Clean currentSong at song end
    const queue = getFunctions().taskQueue("locations/europe-west3/functions/onSongEnd");
    await queue.enqueue(
      {roomKey},
      {scheduleDelaySeconds: duration},
    );
    logger.info(`Listening to ${nextSong.title} (from next)`);
  }
};

const downloadSong = async (songSnapshot: DataSnapshot) => {
  const song = songSnapshot.val();
  const file = admin.storage().bucket().file(`${song.songId}.mp3`);

  // Exit if song file already exists
  if ((await file.exists())[0]) return;

  // Download song file
  logger.info(`Downloading song ${song.songId}`);
  const stream = ytdl(encodeURI(`https://www.youtube.com/watch?v=${song.songId}`), {
    filter: "audioonly",
  });

  await new Promise<void>((resolve) => {
    ffmpeg()
      .input(stream)
      .outputFormat("mp3")
      .on("end", () => {
        logger.info("Song successfully downloaded!");
        resolve();
      })
      .writeToStream(file.createWriteStream());
  });
};

/*
  Will download and load next song on added to playlist queue
  onSongAdded({}, {params: {roomKey: "-NOzbkNAyMWNoqXc2vXN", songKey: "-NOzbmdGhj2GcaJv2ly0"}})
*/
export const onSongAdded = region("europe-west3")
  .database.ref("/playlists/{roomKey}/queue/{songKey}")
  .onCreate((snapshot, context) => {
    const promises = [];

    logger.info(`Song ${context.params.songKey} has been added`);
    logger.info(snapshot);

    if (snapshot.exists()) {
      promises.push(downloadSong(snapshot)
        .then(() => loadNextSong(context.params.roomKey)));
    }

    return Promise.all(promises);
  });

// Will delete current song and load next one
export const onSongEnd = region("europe-west3").tasks.taskQueue({
  retryConfig: {
    maxAttempts: 5,
    minBackoffSeconds: 60,
  },
  rateLimits: {
    maxConcurrentDispatches: 6,
  },
}).onDispatch(async ({roomKey}: { roomKey: string }) => {
  logger.info("Removing song");
  await admin.database().ref(`/playlists/${roomKey}/currentSong`).remove();
  await loadNextSong(roomKey);
});
