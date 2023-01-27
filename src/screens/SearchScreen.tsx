import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Icon, Input, ScrollView, Stack, Text } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FirebaseContext } from '../providers/FirebaseProvider';
import Card from '../components/Card';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { Room } from '../types/database';
import PlaylistButton from '../components/PlaylistButton';

export default function SearchScreen() {
  const [search, setSearch] = useState("")

  const firebase = useContext(FirebaseContext)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
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
    });
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container} m={5}>
      <Card>
        <Input
          value={search}
          onChangeText={setSearch}
          InputLeftElement={
            <Icon as={<Ionicons name="search" />} size={5} ml="2" color="muted.400" />
          }
          placeholder="Looking for a particular room ?" />
        <Text>Public rooms</Text>
        <Stack flexWrap='wrap' w="100%" justifyContent='center' direction='row'>
          {rooms.map((room, i) => <PlaylistButton room={room} key={i} />)}
        </Stack>
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
