import { Alert, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { Avatar, Button, Divider, ScrollView, useToast, Text, View } from "native-base";
import Card from '../components/Card';
import GoogleAuthButton from '../components/GoogleAuthButton';
import Input from '../components/Input';
import Colors from '../constants/Colors';

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
    <View style={styles.container}>
      <ScrollView w='100%'>
        <Card p={5}>
          <Avatar bg={Colors.primary} size="xl" source={{
            uri: firebase.auth.currentUser?.photoURL || undefined
          }}>
            {firebase.auth.currentUser?.displayName}
          </Avatar>
          <Text>{firebase.auth.currentUser?.displayName}</Text>
          <Text>{firebase.auth.currentUser?.email}</Text>

          <Divider my={2} />

          <GoogleAuthButton />

          <Divider my={2} />

          <Input type="password" w="100%" value={curPass} onChangeText={setCurPass} placeholder="Current password" />
          <Input type="password" w="100%" value={newPass} onChangeText={setNewPass} placeholder="New password" />
          <Input type="password" w="100%" value={verPass} onChangeText={setVerPass} placeholder="Confirm password" />
          <Button w="100%" onPress={updatePassword}>Confirm</Button>

          <Divider my={2} />

          <Button w="100%" colorScheme="danger" onPress={logout}>Log out</Button>
        </Card>
      </ScrollView>
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
