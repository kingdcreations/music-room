import { Alert, StyleSheet, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { Avatar, Button, Divider, Input, ScrollView, useToast } from "native-base";
import Card from '../components/Card';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function AccountScreen() {
  const [curPass, setCurPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [verPass, setVerPass] = useState("")

  const toast = useToast();
  const firebase = useContext(FirebaseContext)

  const updatePassword = () => {
    firebase.updatePassword(curPass, newPass, verPass)
      .then(() => {
        setCurPass("")
        setNewPass("")
        setVerPass("")
        toast.show({ description: "Password successfuly updated!" })
      })
      .catch((e) => toast.show({ description: e.code || e.message }))
  }

  const logout = () =>
    Alert.alert(
      "Confirmation",
      "Log out ?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => signOut(firebase.auth)
        }
      ]
    );

  return (
    <ScrollView contentContainerStyle={styles.container} mx={5}>
      <Card>
        <Avatar bg="green.500" size="xl" source={{
          uri: firebase.auth.currentUser?.photoURL || undefined
        }}>
          {firebase.auth.currentUser?.displayName}
        </Avatar>
        <Text>{firebase.auth.currentUser?.displayName}</Text>
        <Text>{firebase.auth.currentUser?.email}</Text>

        <Divider />

        <GoogleAuthButton />

        <Divider />

        <Input type="password" w="100%" value={curPass} onChangeText={setCurPass} placeholder="Current password" />
        <Input type="password" w="100%" value={newPass} onChangeText={setNewPass} placeholder="New password" />
        <Input type="password" w="100%" value={verPass} onChangeText={setVerPass} placeholder="Confirm password" />
        <Button w="100%" onPress={updatePassword}>Confirm</Button>

        <Divider />

        <Button w="100%" colorScheme="error" onPress={logout}>Log out</Button>
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
