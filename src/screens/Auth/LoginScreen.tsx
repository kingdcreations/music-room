import { useState } from 'react';
import { RootStackScreenProps } from '../../types/navigation';
import { signInWithEmailAndPassword } from "firebase/auth/react-native";
import { Button, Text, HStack } from 'native-base';
import { useToast } from 'native-base';
import Container from '../../components/Container';
import Input from '../../components/Input';
import GoogleAuthButton from '../../components/GoogleAuthButton';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../../providers/FirebaseProvider';
import OrDivider from '../../components/OrDivider';

export default function LoginScreen({
  navigation
}: RootStackScreenProps<'Login'>) {
  const toast = useToast();
  const firebase = useFirebase()

  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")

  const login = () => {
    signInWithEmailAndPassword(firebase.auth, mail, pass)
      .then(() => {
        setDoc(doc(firebase.firestore, 'users/' + firebase.auth.currentUser?.uid), {
          email: firebase.auth.currentUser?.email,
        }, { merge: true })
      })
      .catch(e => toast.show({ description: e.code }))
  };

  const signin = () => navigation.navigate('Signin')
  const recover = () => navigation.navigate('Recover')

  return (
    <Container>
      <Input onChangeText={setMail} value={mail} placeholder="Email address" />
      <Input onChangeText={setPass} value={pass} type="password" placeholder="Password" />
      <Button w="100%" onPress={login}>Login</Button>
      <Button variant="link" onPress={recover}>Forgotten password</Button>

      <OrDivider/>

      <GoogleAuthButton />

      <HStack mt={5} alignItems="center">
        <Text>No account yet?</Text>
        <Button variant="link" onPress={signin}>Create now</Button>
      </HStack>
    </Container>
  );
}