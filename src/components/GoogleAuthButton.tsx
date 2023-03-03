import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth/react-native";
import * as Google from 'expo-auth-session/providers/google';
import { Button, Icon } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_CLIENT_ID } from '@env';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../providers/FirebaseProvider';
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuthButton() {
    const firebase = useFirebase()

    const isGoogleAuthed = Boolean(firebase.auth.currentUser?.providerData.find((pvd) => pvd.providerId === 'google.com'))
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: FIREBASE_CLIENT_ID,
        // iosClientId: FIREBASE_CLIENT_ID
    });

    const login = async () => await promptAsync()

    useEffect(() => {
        if (response?.type === 'success') {
            const credential = GoogleAuthProvider.credential(response.params.id_token);
            signInWithCredential(firebase.auth, credential)
                .then(() => setDoc(doc(firebase.firestore, 'users/' + firebase.auth.currentUser?.uid), {
                    email: firebase.auth.currentUser?.email,
                    displayName: firebase.auth.currentUser?.displayName,
                    photoURL: firebase.auth.currentUser?.photoURL,
                }, { merge: true }))
        }
    }, [response]);

    return (
        <Button
            w="100%"
            isDisabled={isGoogleAuthed}
            onPress={login}
            bg="#DE5246"
            _pressed={{
                bg: 'red.600'
            }}
            leftIcon={<Icon as={Ionicons} name="logo-google" size="sm" />}>
            Sign in with Google
        </Button>
    );
}
