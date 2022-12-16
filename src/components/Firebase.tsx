import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from "@env"

export default class Firebase {
    auth: Auth
    db: Firestore

    constructor() {
        const config = {
            appId: FIREBASE_APP_ID,
            apiKey: FIREBASE_API_KEY,
            projectId: FIREBASE_PROJECT_ID,
            authDomain: FIREBASE_AUTH_DOMAIN,
            messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        }
        const app = initializeApp(config);

        this.auth = getAuth(app);
        this.db = getFirestore(app);
    }
}