import { Audio } from "expo-av"
import { Track } from "../types/database"

export default class AudioPlayer {
    data: Track | null

    constructor() {
        console.log("creating");
        this.data = null
    }

    play(data: Track | null) {
        console.log('setting to' + data?.title);
        this.data = data
    }

    stop() {
        console.log('setting to null');
        this.data = null
    }
}