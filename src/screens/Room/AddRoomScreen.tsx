import { Switch } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Divider, Heading, HStack, Text, VStack } from 'native-base';
import Container from '../../components/Container';
import { HomeStackScreenProps } from '../../types/navigation';
import { push, ref, set } from 'firebase/database';
import Input from '../../components/Input';
import { useFirebase } from '../../providers/FirebaseProvider';
import { doc, getDoc } from 'firebase/firestore';

export default function AddRoomScreen({
  navigation
}: HomeStackScreenProps<'AddRoom'>) {
  const firebase = useFirebase()

  const [displayName, setDisplayName] = useState(firebase.auth.currentUser?.displayName)
  const [roomName, setRoomName] = useState(firebase.auth.currentUser?.displayName + "'s room")
  const [privateRoom, setPrivate] = useState(false)
  const [privateVoting, setPrivateVoting] = useState(false)
  const [privateEdition, setPrivateEdition] = useState(false)

  const createRoom = () => {
    set(push(ref(firebase.database, 'rooms')), {
      name: roomName,
      private: privateRoom,
      privateVoting,
      privateEdition,
      owner: {
        uid: firebase.auth.currentUser?.uid,
        displayName,
        photoURL: firebase.auth.currentUser?.photoURL
      },
    })
    navigation.goBack()
  }

  useEffect(() => {
    getDoc(doc(firebase.firestore, `users/${firebase.auth.currentUser?.uid}`))
      .then((snapshotData) => {
        if (snapshotData.exists())
          setDisplayName(snapshotData.data()?.displayName);
        setRoomName(snapshotData.data()?.displayName + "'s room");
      })
  }, []);

  return (
    <Container>
      <Input w="100%" onChangeText={setRoomName} value={roomName} placeholder="Room name" />

      <Divider my={5} />

      <VStack w="100%" space={5}>
        <VStack space={3}>
          <Heading size="md">Visibility</Heading>
          <HStack>
            <VStack flexShrink={1}>
              <Heading size="sm">Private</Heading>
              <Text>Invited users will be the only ones who can find the event and vote</Text>
            </VStack>
            <Switch onValueChange={setPrivate} value={privateRoom} />
          </HStack>
        </VStack>

        {!privateRoom &&
          <VStack space={3}>
            <Heading size="md">Vote license</Heading>
            <HStack>
              <VStack flexShrink={1} mr='auto'>
                <Heading size="sm">Private</Heading>
                <Text>
                  Only invited people will we able to vote
                </Text>
              </VStack>
              <Switch onValueChange={setPrivateVoting} value={privateVoting} />
            </HStack>
          </VStack>}

        {!privateRoom &&
          <VStack space={3}>
            <Heading size="md">Edit license</Heading>
            <HStack>
              <VStack flexShrink={1} mr='auto'>
                <Heading size="sm">Private</Heading>
                <Text>
                  Only invited people will we able to edit
                </Text>
              </VStack>
              <Switch onValueChange={setPrivateEdition} value={privateEdition} />
            </HStack>
          </VStack>}
      </VStack>

      <Divider my={5} />

      <Button w="100%" onPress={createRoom}>Create room</Button>
    </Container>
  );
}