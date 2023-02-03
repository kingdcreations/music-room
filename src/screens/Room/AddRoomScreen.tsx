import { StyleSheet, Switch } from 'react-native';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../../providers/FirebaseProvider';
import { Button, Divider, Heading, HStack, ScrollView, Text, VStack } from 'native-base';
import Card from '../../components/Card';
import { HomeStackScreenProps } from '../../types';
import { push, ref, set } from 'firebase/database';
import Input from '../../components/Input';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function AddRoomScreen({
  navigation
}: HomeStackScreenProps<'AddRoom'>) {
  const firebase = useContext(FirebaseContext)
  const [roomName, setRoomName] = useState(firebase.auth.currentUser?.displayName + "'s room")
  const [privateRoom, setPrivate] = useState(false)
  const [privateVoting, setPrivateVoting] = useState(false)
  const [privateEdition, setPrivateEdition] = useState(false)
  const [custom, setCustom] = useState(false)

  const [startTime, setStartTime] = useState(new Date())

  const createRoom = () => {
    set(push(ref(firebase.database, 'rooms')), {
      name: roomName,
      private: privateRoom,
      owner: {
        uid: firebase.auth.currentUser?.uid,
        displayName: firebase.auth.currentUser?.displayName,
        photoURL: firebase.auth.currentUser?.photoURL
      },
    })
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={styles.container} mx={5}>
      <Card>
        <Input onChangeText={setRoomName} value={roomName} placeholder="Room name" />
        <Divider />

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

          <VStack space={3}>
            <Heading size="md">Vote license</Heading>
            {!privateRoom &&
              <HStack>
                <VStack flexShrink={1} mr='auto'>
                  <Heading size="sm">Private</Heading>
                  <Text>
                    Only invited people will we able to vote
                  </Text>
                </VStack>
                <Switch onValueChange={setPrivateVoting} value={privateVoting} />
              </HStack>}
            {!privateVoting && <HStack>
              <VStack flexShrink={1} mr='auto'>
                <Heading size="sm">Custom</Heading>
                <Text>
                  Only people with met condition we able to vote
                </Text>
              </VStack>
              <Switch onValueChange={setCustom} value={custom} />
            </HStack>}
            {custom &&
              <VStack>
                <Button>Start time</Button>
                <Button>End time</Button>
              </VStack>
            }
          </VStack>

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

        <Divider />
        <Button w="100%" onPress={createRoom}>Create room</Button>
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
