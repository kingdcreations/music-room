import { initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Database, getDatabase } from "firebase/database";

import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from "@env"

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

        this.auth = getAuth(app);
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
}