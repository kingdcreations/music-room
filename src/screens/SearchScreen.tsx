import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Icon, Input, ScrollView, Text } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FirebaseContext } from '../providers/FirebaseContext';
import Card from '../components/Card';
import { limitToLast, onValue, query, ref } from 'firebase/database';
import { Room } from '../types/database';

export default function SearchScreen() {
  const [search, setSearch] = useState("")

  const firebase = useContext(FirebaseContext)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    const q = query(ref(firebase.database, 'rooms'), limitToLast(8));
    return onValue(q, (snapshot) => {
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
        <>{rooms.map((room, i) => <Button key={i} w="100%">{room.name}</Button>)}</>
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
