import { StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { RootStackScreenProps } from '../types';
import { Button, FormControl, Input, ScrollView, useToast } from 'native-base';
import Card from '../components/Card';

export default function Recover({
  navigation
}: RootStackScreenProps<'Recover'>) {

  const [mail, setMail] = useState("")

  const toast = useToast();
  const firebase = useContext(FirebaseContext)

  const recover = () => {
    sendPasswordResetEmail(firebase.auth, mail)
      .catch(e => toast.show({ description: e.code }))
  }

  return (
    <ScrollView contentContainerStyle={styles.container} mx={5}>
      <Card>
        <FormControl isRequired>
          <FormControl.Label>Email address</FormControl.Label>
          <Input onChangeText={setMail} value={mail} placeholder="Email address" />
        </FormControl>
        <Button w="100%" onPress={recover}>Recover</Button>
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
