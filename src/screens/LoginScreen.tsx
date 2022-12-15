import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useContext, useState } from 'react';
import { RootStackScreenProps } from '../types';
import { FirebaseContext } from '../providers/FirebaseContext';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({
  navigation
}: RootStackScreenProps<'Login'>) {

  const [mail, setMail] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("");

  const firebase = useContext(FirebaseContext)

  const login = () => {
    firebase?.auth && signInWithEmailAndPassword(firebase.auth, mail, pass)
      .catch(e => setError(e.code))
  };

  const signin = () => navigation.navigate('Signin')

  const recover = () => navigation.navigate('Recover')

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
      <TouchableOpacity onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signin}>
        <Text>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={recover}>
        <Text>Recover password</Text>
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
