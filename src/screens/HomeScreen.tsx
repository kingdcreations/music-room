import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { Button, ScrollView, Stack, View, Heading, Divider } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { equalTo, get, onValue, orderByChild, orderByKey, query, ref } from 'firebase/database';
import { Join, Room } from '../types/database';
import PlaylistButton from '../components/PlaylistButton';

export default function HomeScreen({
  navigation
}: HomeStackScreenProps<'Home'>) {
  const firebase = useContext(FirebaseContext)
  const uid = firebase.auth.currentUser?.uid

  const [rooms, setRooms] = useState<Room[]>([])
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([])

  useEffect(() => {
    if (!uid) return

    const q = query(ref(firebase.database, 'rooms'), orderByChild('owner/uid'), equalTo(uid))
    return onValue(q, (snapshot) => {
      setRooms([])
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.values(data).map((room, i) => setRooms((rooms) => {
          const newRoom = room as Room;
          newRoom.id = Object.keys(data)[i]
          return [...rooms, newRoom]
        }));
      }
    });
  }, [])

  useEffect(() => {
    if (!uid) return

    const q = query(
      ref(firebase.database, 'joins'),
      orderByChild('user/uid'),
      equalTo(uid))
    return onValue(q, (snapshot) => {
      setJoinedRooms([])
      if (snapshot.exists()) {
        const joins = Object.values(snapshot.val()) as Join[]
        const promises = joins.map(async (join) => {
          const room = await get(ref(firebase.database, 'rooms/' + join.roomID))
          return { id: room.key, ...room.val() }
        });
        Promise.all(promises).then(data => setJoinedRooms(data))
      }
    });
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView w='100%'>
        <Card p={5}>
          <Button w="100%" onPress={() => navigation.navigate('AddRoom')}>New room</Button>
          {rooms.length !== 0 && <>
            <Divider my={2} />
            <Heading size="md">My rooms</Heading>
            <Stack flexWrap='wrap' w="100%" justifyContent='center' direction='row'>
              {rooms.map((room, i) => <PlaylistButton room={room} key={i} />)}
            </Stack>
          </>}

          {joinedRooms.length !== 0 && <>
            <Divider my={2} />
            <Heading size="md">Joined rooms</Heading>
            <Stack flexWrap='wrap' w="100%" justifyContent='center' direction='row'>
              {joinedRooms.map((room, i) => <PlaylistButton room={room} key={i} />)}
            </Stack>
          </>}
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
