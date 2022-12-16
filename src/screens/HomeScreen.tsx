import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';

export default function HomeScreen() {
  const firebase = useContext(FirebaseContext)

  const logout = () => firebase?.auth && signOut(firebase.auth)

  return (
    <View style={styles.container}>
      <Text>You are logged as {firebase?.auth.currentUser?.displayName}!</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Log out</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
