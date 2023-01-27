import admin from "firebase-admin"
import { DataSnapshot } from "@firebase/database-types"
import { Track } from "../types"
import ytdl from "ytdl-core";
import path from "path";
import fs from "fs";

export default class Room {
    data: DataSnapshot
    songs: Map<string, Track>

    currentSong: Track | null
    songStartedAt: number

    constructor(data: DataSnapshot) {
        this.data = data
        this.songs = new Map()

        this.currentSong = null
        this.songStartedAt = -1

        this.loadCurrentSong()

        const ref = admin.database().ref(`/playlists/${data.key}/queue`)
        ref.on('child_added', (dataSnapshot) => {
            if (dataSnapshot.exists() && dataSnapshot.key) {
                this.songs.set(dataSnapshot.key, dataSnapshot.val())
                this.downloadSong(dataSnapshot.val())
                    .then(() => this.loadNextSong())
            }
        })

        ref.on('child_removed', (dataSnapshot) => {
            if (dataSnapshot.exists() && dataSnapshot.key) {
                this.songs.delete(dataSnapshot.key)
            }
        })
    }

    async loadCurrentSong() {
        const currentSongRef = admin.database().ref(`/playlists/${this.data.key}/currentSong`)
        const currentSong = (await currentSongRef.get()).val()

        // Load current song if exists
        if (currentSong) {
            const song = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${currentSong?.id}`)
            const duration = parseInt(song.player_response.videoDetails.lengthSeconds) * 1000
            setTimeout(() => this.onSongEnd(), duration)

            this.songStartedAt = Date.now()
            this.currentSong = currentSong
            console.log(`Listening to ${this.currentSong?.title}`);
        }
    }

    async loadNextSong() {
        const currentSongRef = admin.database().ref(`/playlists/${this.data.key}/currentSong`)
        const currentSong = (await currentSongRef.get()).val()

        // If there is no current song and a next song is available
        const nextSong = this.songs.entries().next().value;
        if (!currentSong && nextSong) {
            const nextSongKey = nextSong[0]
            const nextSongData = nextSong[1]

            // Remove the next song from the queue
            await admin.database()
                .ref(`/playlists/${this.data.key}/queue/${nextSongKey}`).remove()
            console.log(`Removing ${nextSongData.title} from queue`);

            // Get song duration and launch function at the end
            const song = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${nextSongData?.id}`)
            const duration = parseInt(song.player_response.videoDetails.lengthSeconds) * 1000
            setTimeout(() => this.onSongEnd(), duration)

            // Save current song data
            this.songStartedAt = Date.now()

            currentSongRef.set(nextSongData)
            this.currentSong = nextSongData
            console.log(`Listening to ${this.currentSong?.title} (from next)`);
        }
    }

    getCurrentSongStream() {
        return {
            currentSong: this.currentSong,
            currentTime: Date.now() - this.songStartedAt
        }
    }

    async downloadSong(song: Track) {
        return new Promise<void>((resolve) => {
            const output = path.resolve(__dirname, `../downloads/${song.id}.mp3`);
            fs.access(output, fs.constants.F_OK, (err) => {
                if (err) { // File not downloaded yet
                    console.log(`Downloading from id ${song.id}`);

                    const stream = ytdl(encodeURI(`https://www.youtube.com/watch?v=${song.id}`), {
                        filter: 'audioonly',
                    })
                    stream.pipe(fs.createWriteStream(output))
                    stream.on("finish", resolve);
                } else {
                    resolve()
                }
            })
        })
    }

    async onSongEnd() {
        console.log(`Removing ${this.currentSong?.title} from listening instance`);

        await admin.database().ref(`/playlists/${this.data.key}/currentSong`).remove()
        this.currentSong = null
        await this.loadNextSong()
    }
}