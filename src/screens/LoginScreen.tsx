import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { RootStackScreenProps } from '../types';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import { Input, Button, FormControl, Text, Divider, Icon, ScrollView } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useToast } from 'native-base';
import { FIREBASE_CLIENT_ID } from '@env';
import Card from '../components/Card';

export default function LoginScreen({
  navigation
}: RootStackScreenProps<'Login'>) {

  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")

  const toast = useToast();
  const firebase = useContext(FirebaseContext)

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: FIREBASE_CLIENT_ID,
    // iosClientId: FIREBASE_CLIENT_ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const credential = GoogleAuthProvider.credential(response.params.id_token);
      signInWithCredential(firebase.auth, credential);
    }
  }, [response]);

  const login = () => {
    signInWithEmailAndPassword(firebase.auth, mail, pass)
      .catch(e => toast.show({ description: e.code }))
  };

  const signin = () => navigation.navigate('Signin')
  const recover = () => navigation.navigate('Recover')

  return (
    <ScrollView contentContainerStyle={styles.container} mx={5}>
      <Card>
        <FormControl isRequired>
          <FormControl.Label>Email address</FormControl.Label>
          <Input onChangeText={setMail} value={mail} placeholder="Email address" />

          <FormControl.Label>Password</FormControl.Label>
          <Input onChangeText={setPass} value={pass} type="password" placeholder="Password" />
        </FormControl>
        <Button w="100%" onPress={login}>Login</Button>

        <Divider />

        <Button
          w="100%"
          variant="outline"
          onPress={() => promptAsync()}
          leftIcon={<Icon as={Ionicons} name="logo-google" size="sm" />}>
          Sign in with Google
        </Button>
        <Button variant="link" onPress={recover}>Forgotten password</Button>
      </Card>

      <Card>
        <Text>No account yet?</Text>
        <Button w="100%" onPress={signin}>Sign in</Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
