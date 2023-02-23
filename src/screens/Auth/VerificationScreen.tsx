import { Button, Text } from 'native-base';
import Container from '../../components/Container';
import { useFirebase } from '../../providers/FirebaseProvider';
import { sendEmailVerification, signOut } from 'firebase/auth';

export default function VerificationScreen() {
  const firebase = useFirebase()

  const logout = () => signOut(firebase.auth)
  const resend = () => firebase.auth.currentUser && sendEmailVerification(firebase.auth.currentUser)

  return (
    <Container footer={
      <Button w="100%" onPress={logout}>Continue</Button>
    }>
      <Text mb={3}>Check your mail address and verify your account</Text>
      <Button w="100%" colorScheme='emerald' onPress={resend}>Resend mail</Button>
    </Container>
  );
}