import { useState, useEffect } from 'react';
import { Avatar, Button, Divider, useToast, Text } from "native-base";
import Container from '../components/Container';
import GoogleAuthButton from '../components/GoogleAuthButton';
import Input from '../components/Input';
import Colors from '../constants/Colors';
import { useFirebase } from '../providers/FirebaseProvider';
import { doc, getDoc } from 'firebase/firestore';
import * as Clipboard from 'expo-clipboard';
import OrDivider from '../components/OrDivider';
import Devices from '../components/Devices';
import { Linking } from 'react-native';

export default function AccountScreen() {
  const toast = useToast();
  const firebase = useFirebase()

  const [name, setName] = useState("")
  const [curPass, setCurPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [verPass, setVerPass] = useState("")

  const updateName = () => {
    if (name.length > 3 && name.length < 32)
      firebase.updateName(name)
        .then(() => toast.show({ description: "Username successfuly updated!" }))
        .catch((e) => toast.show({ description: e.code || e.message }))
    else toast.show({ description: "Username must be between 3 and 32 character" })
  }

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

  const genApiToken = () => {
    firebase.auth.currentUser?.getIdToken().then((ApiToken) => {
      Clipboard.setStringAsync(ApiToken).then(() => {
        toast.show({ description: "Your API token has been successfully copied to your Clipboard ! " })
      })
      .catch((e) => toast.show({ description: "Error while setting Clipboard paste." }))
    })
    .catch((e) => toast.show({ description: "Error while fetching Your Api Token." }))
  }

  const openApiDoc = async () => {
    await Linking.openURL("https://github.com/kingdcreations/music-room#readme");
  }

  useEffect(() => {
    getDoc(doc(firebase.firestore, `users/${firebase.auth.currentUser?.uid}`))
      .then((snapshotData) => {
        if (snapshotData.exists())
          setName(snapshotData.data().displayName);
      })
  }, [])

  return (
    <Container center>
      <Avatar bg={Colors.primary} size="xl" source={{
        uri: firebase.auth.currentUser?.photoURL || undefined
      }}>
        {firebase.auth.currentUser?.displayName}
      </Avatar>
      <Text>{firebase.auth.currentUser?.email}</Text>

      <Text bold w="100%">Username</Text>
      <Input type="text" w="100%" value={name} onChangeText={setName} placeholder="Username" />
      <Button w="100%" onPress={updateName}>Confirm</Button>

      <Divider my={3} />

      <Text bold w="100%">Password</Text>
      <Input type="password" w="100%" value={curPass} onChangeText={setCurPass} placeholder="Current password" />
      <Input type="password" w="100%" value={newPass} onChangeText={setNewPass} placeholder="New password" />
      <Input type="password" w="100%" value={verPass} onChangeText={setVerPass} placeholder="Confirm password" />
      <Button w="100%" onPress={updatePassword}>Confirm</Button>

      <Devices />

      <Divider my={3} />

      <Text bold w="100%">API</Text>
      <Button w="100%" onPress={genApiToken}>Click to copy API Token to your Clipboard</Button>
      <Button w="100%" variant="link" onPress={openApiDoc}>Documentation</Button>

      <OrDivider />
      
      <GoogleAuthButton />
    </Container>
  );
}