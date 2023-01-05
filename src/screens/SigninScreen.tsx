import { StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { RootStackScreenProps } from '../types';
import { Button, FormControl, Input, ScrollView, useToast } from 'native-base';
import Card from '../components/Card';
import { addDoc, collection } from 'firebase/firestore';

export default function SigninScreen({
  navigation
}: RootStackScreenProps<'Signin'>) {

  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")

  const toast = useToast();
  const firebase = useContext(FirebaseContext)

  const signin = () => {
    createUserWithEmailAndPassword(firebase.auth, mail, pass)
    .then(() => {
      addDoc(collection(firebase.firestore, 'users'), {
        uid: firebase.auth.currentUser?.uid,
        mail: firebase.auth.currentUser?.email,
        verified: firebase.auth.currentUser?.emailVerified,
      })
    })
      .catch(e => toast.show({ description: e.code }))
  }

  return (
    <ScrollView contentContainerStyle={styles.container} mx={5}>
      <Card>
        <FormControl isRequired>
          <FormControl.Label>Email address</FormControl.Label>
          <Input onChangeText={setMail} value={mail} placeholder="Email address" />

          <FormControl.Label>Password</FormControl.Label>
          <Input onChangeText={setPass} value={pass} type="password" placeholder="Password" />
        </FormControl>
        <Button w="100%" onPress={signin}>Sign in</Button>
        <Button w="100%" colorScheme='gray' onPress={() => navigation.goBack()}>Cancel</Button>
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
