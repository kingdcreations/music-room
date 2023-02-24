import { Auth } from "firebase/auth/react-native";
import { Database } from "firebase/database";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { Track, User } from "./data";

export type FirebaseContextType = {
    auth: Auth;
    database: Database;
    firestore: Firestore;
    storage: FirebaseStorage;
    updateName: (name: string) => Promise<void>;
    updatePassword: (curPass: string, newPass: string, verPass: string) => Promise<void>;
    addSongToPlaylist: (song: Track, roomID: string) => Promise<void>;
    addUserToRoom: (user: User, roomID: string) => Promise<void>;
}