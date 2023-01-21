import { StyleSheet, Text } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { Button, ScrollView, Stack, View } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { Room } from '../types/database';
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
      const data = snapshot.val();

      setRooms([])
      if (snapshot.exists()) {
        Object.values(data).map((room, i) => setRooms((rooms) => {
          const newRoom = room as Room;
          newRoom.id = Object.keys(data)[i]
          return [...rooms, newRoom]
        }));
      }
    });
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5} contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Text>My rooms</Text>
          <Stack flexWrap='wrap' w="100%" justifyContent='center' direction='row'>
            {rooms.map((room, i) => <PlaylistButton room={room} key={i} />)}
          </Stack>
          <Button w="100%" colorScheme='emerald' onPress={() => navigation.navigate('NewRoom')}>New room</Button>
        </Card>

        <Card>
          <Text>Joined rooms</Text>
          <Stack flexWrap='wrap' w="100%" justifyContent='center' direction='row'>
            {joinedRooms.map((room, i) => <PlaylistButton room={room} key={i} />)}
          </Stack>
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
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
