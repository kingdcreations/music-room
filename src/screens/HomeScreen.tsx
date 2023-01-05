import { StyleSheet, Text } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { Button, ScrollView, View } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { onValue, ref } from 'firebase/database';
import { Room } from '../types/database';

export default function HomeScreen({
  navigation
}: HomeStackScreenProps<'Home'>) {
  const firebase = useContext(FirebaseContext)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    return onValue(ref(firebase.database, 'rooms'), (snapshot) => {
      const data = snapshot.val();

      setRooms([])
      if (snapshot.exists()) {
        Object.values(data).map((room) => {
          setRooms((rooms) => [...rooms, room as Room]);
        });
      }
    });
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          <Text>Create your own room</Text>
          <Button w="100%" colorScheme='emerald' onPress={() => navigation.navigate('NewRoom')}>Add songs</Button>
        </Card>

        <Card>
          <Text>My rooms</Text>
          <>{rooms.map((room, i) => <Button key={i} w="100%">{room.name}</Button>)}</>
        </Card>

        <Card>
          <Text>Joined rooms</Text>
          <>{rooms.map((room, i) => <Button key={i} w="100%">{room.name}</Button>)}</>
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
