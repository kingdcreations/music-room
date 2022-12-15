import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { RootStackScreenProps } from '../types';

export default function Recover({
  navigation
}: RootStackScreenProps<'Recover'>) {

  const [mail, setMail] = useState("")
  const [error, setError] = useState("");

  const firebase = useContext(FirebaseContext)

  const recover = () => {
    firebase?.auth && sendPasswordResetEmail(firebase.auth, mail)
      .then(() => setError(""))
      .catch(e => setError(e.code))
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setMail}
        value={mail}
        placeholder="Mail"
      />
      <TouchableOpacity onPress={recover}>
        <Text>Recover</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Cancel</Text>
      </TouchableOpacity>
      <Text>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
