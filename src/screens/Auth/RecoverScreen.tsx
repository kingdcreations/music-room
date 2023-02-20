import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { RootStackScreenProps } from '../../types/navigation';
import { Button, FormControl, useToast } from 'native-base';
import Container from '../../components/Container';
import Input from '../../components/Input';
import { useFirebase } from '../../providers/FirebaseProvider';

export default function Recover({
  navigation
}: RootStackScreenProps<'Recover'>) {
  const toast = useToast();
  const firebase = useFirebase()

  const [mail, setMail] = useState("")

  const recover = () => {
    sendPasswordResetEmail(firebase.auth, mail)
      .catch(e => toast.show({ description: e.code }))
  }

  return (
    <Container>
      <FormControl isRequired>
        <FormControl.Label>Email address</FormControl.Label>
        <Input onChangeText={setMail} value={mail} placeholder="Email address" />
      </FormControl>
      <Button w="100%" onPress={recover}>Recover</Button>
      <Button w="100%" colorScheme='gray' onPress={() => navigation.goBack()}>Cancel</Button>
    </Container>
  );
}