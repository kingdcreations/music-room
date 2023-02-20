import React, { useEffect, useState } from 'react';
import { Spinner, Stack } from 'native-base';
import Container from '../components/Container';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { Room } from '../types/data';
import PlaylistButton from '../components/PlaylistButton';
import { useFirebase } from '../providers/FirebaseProvider';

export default function SearchScreen() {
  const firebase = useFirebase()

  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    setLoading(true)
    const q = query(ref(firebase.database, 'rooms'), orderByChild('private'), equalTo(false));
    return onValue(q, (snapshot) => {
      const data = snapshot.val();

      setRooms([])
      if (snapshot.exists()) {
        Object.values(data).map((room, i) => setRooms((rooms) => {
          const newRoom = room as Room;
          newRoom.id = Object.keys(data)[i]
          return ([...rooms, room as Room])
        }));
      }
      setLoading(false)
    }, (e) => console.error(e));
  }, [])

  return (
    <Container>
      <Stack flexWrap='wrap' w="100%" justifyContent='center' direction='row'>
        {!loading ?
          rooms.map((room, i) => <PlaylistButton room={room} key={i} />)
          :
          <Spinner size="lg" />}
      </Stack>
    </Container>
  );
}