import { StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { Button, Checkbox, Input, ScrollView } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { push, ref, set } from 'firebase/database';

export default function NewRoomScreen({
  navigation
}: HomeStackScreenProps<'NewRoom'>) {
  const firebase = useContext(FirebaseContext)
  const [roomName, setRoomName] = useState(firebase.auth.currentUser?.displayName + "'s room")
  const [privateRoom, setPrivate] = useState(false)

  const createRoom = () => {
    set(push(ref(firebase.database, 'rooms')), {
      name: roomName,
      private: privateRoom,
      owner: firebase.auth.currentUser?.uid,
      playlist: []
    })
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={styles.container} mx={5}>
      <Card>
        <Input onChangeText={setRoomName} value={roomName} placeholder="Room name" />
        <Checkbox onChange={setPrivate} size="sm" isChecked={privateRoom} value="private">
          Private
        </Checkbox>
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
