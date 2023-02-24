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

const loadNextSong = async (roomKey: string) => {
  logger.info("Imma load the next song brother");
  const currentSongRef = admin.database().ref(`/playlists/${roomKey}/currentSong`);
  const queueSongRef = admin.database().ref(`/playlists/${roomKey}/queue`);
  const currentSong = (await currentSongRef.get()).val();
  let nextSong: Array<string | Track> = [];

  // Find the most voted song in the DB
  await queueSongRef.orderByChild("vote").limitToLast(1).get()
    .then((snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        nextSong = [Object.entries<Track>(data)[0][0],
          Object.entries<Track>(data)[0][1]];
      }
    });

  logger.info(`Song ${nextSong} has been loaded`);

  // If there is no current song and a next song is available
  if (!currentSong && nextSong.length === 2) {
    logger.info("No current song available but a nextSong is here");
    const nextSongKey = nextSong[0] as string;
    const nextSongData = nextSong[1] as Track;

    // Remove the next song from the queue
    await admin.database()
      .ref(`/playlists/${roomKey}/queue/${nextSongKey}`).remove();

    logger.info(`NextSong ${nextSongData.title} has been removed from ${roomKey} queue `);

    // Get song duration and launch function at the end
    const song = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${nextSongData?.songId}`);
    const duration = parseInt(song.player_response.videoDetails.lengthSeconds);

    // Save current song data
    nextSongData.startedAt = Date.now();
    await currentSongRef.set(nextSongData);

    // Clean currentSong at song end
    const queue = getFunctions().taskQueue("locations/europe-west3/functions/onSongEnd");
    await queue.enqueue(
      {roomKey},
      {scheduleDelaySeconds: duration},
    );
    logger.info(`Listening to ${nextSongData.title} (from next)`);
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
