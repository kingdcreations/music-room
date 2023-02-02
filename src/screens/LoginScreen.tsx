import { StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { RootStackScreenProps } from '../types';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button, FormControl, Text, Divider, ScrollView } from 'native-base';
import { useToast } from 'native-base';
import Card from '../components/Card';
import Input from '../components/Input';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function LoginScreen({
  navigation
}: RootStackScreenProps<'Login'>) {

  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")

  const toast = useToast();
  const firebase = useContext(FirebaseContext)

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

        <GoogleAuthButton />
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
