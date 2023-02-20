import { useEffect, useState } from 'react';
import { Button, Stack, Heading, Divider } from 'native-base';
import { HomeStackScreenProps } from '../types/navigation';
import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { Join, Room } from '../types/data';
import PlaylistButton from '../components/PlaylistButton';
import { useFirebase } from '../providers/FirebaseProvider';
import Container from '../components/Container';

export default function HomeScreen({
  navigation
}: HomeStackScreenProps<'Home'>) {
  const firebase = useFirebase()
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
    }, (e) => console.error(e));
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
    <Container>
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
    </Container>
  );
}