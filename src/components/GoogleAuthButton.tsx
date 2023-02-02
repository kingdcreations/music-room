import { useContext, useEffect } from 'react';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import { Button, Icon } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_CLIENT_ID } from '@env';
import { addDoc, collection } from 'firebase/firestore';


export default function GoogleAuthButton() {
    const firebase = useContext(FirebaseContext)

    const isGoogleAuthed = Boolean(firebase.auth.currentUser?.providerData.find((pvd) => pvd.providerId === 'google.com'))
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: FIREBASE_CLIENT_ID,
        // iosClientId: FIREBASE_CLIENT_ID
    });

    const login = async () => await promptAsync()

    useEffect(() => {
        if (response?.type === 'success') {
            const credential = GoogleAuthProvider.credential(response.params.id_token);
            signInWithCredential(firebase.auth, credential).then(() => {
                addDoc(collection(firebase.firestore, 'users'), {
                    uid: firebase.auth.currentUser?.uid,
                    mail: firebase.auth.currentUser?.email,
                    verified: firebase.auth.currentUser?.emailVerified,
                    displayName: firebase.auth.currentUser?.displayName,
                    photoURL: firebase.auth.currentUser?.photoURL,
                })
            })
        }
    }, [response]);

    return (
        <Button
            w="100%"
            isDisabled={isGoogleAuthed}
            onPress={login}
            leftIcon={<Icon as={Ionicons} name="logo-google" size="sm" />}>
            Sign in with Google
        </Button>
    );
}
