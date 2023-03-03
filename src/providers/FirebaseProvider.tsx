import { createContext, useContext, useEffect, useState } from 'react';
import { getApp, getApps, initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDatabase, onDisconnect, onValue, push, ref, remove, set } from "firebase/database";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseContextType } from '../types/FirebaseContextType';
import { Track, User } from "../types/data";
import {
    User as UserAuth,
    getAuth,
    initializeAuth,
    onAuthStateChanged,
    getReactNativePersistence,
    signInWithEmailAndPassword,
    updatePassword as updatePasswordAuth
} from 'firebase/auth/react-native';
import {
    FIREBASE_APP_ID,
    FIREBASE_API_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
} from "@env"
import { androidId } from 'expo-application';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

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
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        databaseURL: "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app"
    }

    const isAppInitialized = getApps().length
    const app = isAppInitialized ? getApp() : initializeApp(config);

    // Public 
    const storage = getStorage(app);
    const database = getDatabase(app);
    const firestore = getFirestore(app);
    const auth = isAppInitialized ? getAuth() : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });

    const getDeviceId = async () => {
        if (Platform.OS === "android")
            return androidId;
        else if (Platform.OS === "ios")
            return await Application.getIosIdForVendorAsync();
    }

    const [user, setUser] = useState<UserAuth | null>(null);
    useEffect(() => onAuthStateChanged(firebase.auth, (u) => setUser(u)), []);

    const updateName = async (name: string) => {
        updateDoc(doc(firestore, `users/${auth.currentUser?.uid}`), { displayName: name })
    }

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


    // Device listing
    const connectedRef = ref(database, '.info/connected');
    useEffect(() => {
        return onValue(connectedRef, async (snap) => {
            if (snap.val() === true && user) {
                const con = ref(database, `devices/${user.uid}/connections/${await getDeviceId()}`);
                await set(con, {
                    os: Platform.OS,
                    deviceName: Device.deviceName
                });
                await onDisconnect(con).remove();
            }
        });
    }, [user])

    const firebase = {
        auth,
        user,
        storage,
        database,
        firestore,
        updateName,
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