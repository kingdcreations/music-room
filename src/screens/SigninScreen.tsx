import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { RootStackScreenProps } from '../types';

export default function SigninScreen({
  navigation
}: RootStackScreenProps<'Signin'>) {

  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("");

  const firebase = useContext(FirebaseContext)

  const signin = () => {
    firebase?.auth && createUserWithEmailAndPassword(firebase.auth, mail, pass)
      .catch(e => setError(e.code))
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setMail}
        value={mail}
        placeholder="Mail"
      />
      <TextInput
        onChangeText={setPass}
        value={pass}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={signin}>
        <Text>Sign in</Text>
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
