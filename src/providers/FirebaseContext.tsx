import { initializeApp } from "firebase/app";
import { Auth, initializeAuth, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Database, getDatabase, push, ref, update } from "firebase/database";
import { getReactNativePersistence } from 'firebase/auth/react-native';

import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Track, User } from "../types/database";

export default class Firebase {
    auth: Auth
    firestore: Firestore
    database: Database

    constructor() {
        const config = {
            appId: FIREBASE_APP_ID,
            apiKey: FIREBASE_API_KEY,
            projectId: FIREBASE_PROJECT_ID,
            authDomain: FIREBASE_AUTH_DOMAIN,
            messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
            databaseURL: "music-room-81182-default-rtdb.europe-west1.firebasedatabase.app",
        }
        const app = initializeApp(config);

        this.auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
        this.firestore = getFirestore(app);
        this.database = getDatabase(app);
    }

    updatePassword = async (curPass: string, newPass: string, verPass = newPass) => {
        const user = this.auth.currentUser

        if (newPass === verPass && user && user.email) {
            const userCredential = await signInWithEmailAndPassword(this.auth, user?.email, curPass)
            return await updatePassword(userCredential.user, newPass)
        } else {
            throw new Error("Passwords don't match");
        }
    }

    addSongToPlaylist = async (song: Track, roomID: string) => {
        const playlistRef = ref(this.database, 'playlists/' + roomID + '/queue');
        const songKey = push(playlistRef, song)
        song.key = songKey.key as string
        const songRef = ref(this.database, 'playlists/' + roomID + '/queue/' + song.key);
        update(songRef, song)
    }

    addUserToRoom = async (user: User, roomID: string) => {
        const playlistRef = ref(this.database, 'joins');
        push(playlistRef, {
            user,
            roomID
        })
    }
}