import { createContext, useContext } from 'react';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, signInWithEmailAndPassword, updatePassword as updatePasswordAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, push, ref, set } from "firebase/database";
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseContextType } from '../types/FirebaseContextType';
import { Track, User } from "../types/data";
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from "@env"

const FirebaseContext = createContext<FirebaseContextType>(null!)

export const useFirebase = () => {
    const firebaseContext = useContext(FirebaseContext);
    if (!firebaseContext) throw new Error(
        "useFirebase has to be used within <FirebaseContext.Provider>"
    );
    return firebaseContext;
};

export default function FirebaseProvider({ children }: { children: JSX.Element }) {
    const config = {
        appId: FIREBASE_APP_ID,
        apiKey: FIREBASE_API_KEY,
        projectId: FIREBASE_PROJECT_ID,
        authDomain: FIREBASE_AUTH_DOMAIN,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        databaseURL: "music-room-81182-default-rtdb.europe-west1.firebasedatabase.app",
    }

    const isAppInitialized = getApps().length
    const app = isAppInitialized ? getApp() : initializeApp(config);

    // Public 
    const database = getDatabase(app);
    const firestore = getFirestore(app);
    const auth = isAppInitialized ? getAuth() : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });

    const updatePassword = async (curPass: string, newPass: string, verPass = newPass) => {
        const user = auth.currentUser

        if (newPass === verPass && user && user.email) {
            const userCredential = await signInWithEmailAndPassword(auth, user?.email, curPass)
            return await updatePasswordAuth(userCredential.user, newPass)
        } else {
            throw new Error("Passwords don't match");
        }
    }

    const addSongToPlaylist = async (song: Track, roomID: string) => {
        const playlistRef = ref(database, 'playlists/' + roomID + '/queue');
        await push(playlistRef, song)
    }

    const addUserToRoom = async (user: User, roomID: string) => {
        const playlistRef = ref(database, 'joins');
        await push(playlistRef, { user, roomID })
        const userRef = ref(database, 'rooms/' + roomID + '/users/' + user.uid);
        await set(userRef, true)
    }

    const firebase = {
        database,
        firestore,
        auth,
        updatePassword,
        addSongToPlaylist,
        addUserToRoom
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
}