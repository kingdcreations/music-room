import { useState } from 'react';
import { useFirebase } from '../../providers/FirebaseProvider';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { RootStackScreenProps } from '../../types/navigation';
import { Button, useToast } from 'native-base';
import { doc, setDoc } from 'firebase/firestore';
import Input from '../../components/Input';
import Container from '../../components/Container';

export default function SigninScreen({
  navigation
}: RootStackScreenProps<'Signin'>) {
  const toast = useToast();
  const firebase = useFirebase()

  const [name, setName] = useState("")
  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")

  const signin = () => {
    if (name.length > 3 && name.length < 32)
      createUserWithEmailAndPassword(firebase.auth, mail, pass)
        .then((auth) => {
          sendEmailVerification(auth.user)
          setDoc(doc(firebase.firestore, 'users/' + firebase.auth.currentUser?.uid), {
            displayName: name,
            email: firebase.auth.currentUser?.email,
          }, { merge: true })
        })
        .catch(e => toast.show({ description: e.code }))
    else toast.show({ description: "Username must be between 3 and 32 character" })
  }

  return (
    <Container>
      <Input onChangeText={setName} value={name} placeholder="Username" />
      <Input onChangeText={setMail} value={mail} placeholder="Email address" />
      <Input onChangeText={setPass} value={pass} type="password" placeholder="Password" />
      <Button w="100%" onPress={signin}>Sign in</Button>
      <Button w="100%" colorScheme='gray' onPress={() => navigation.goBack()}>Cancel</Button>
    </Container>
  );
}