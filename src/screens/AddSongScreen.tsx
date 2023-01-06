import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Icon, Input, ScrollView, Stack, Text } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FirebaseContext } from '../providers/FirebaseContext';
import Card from '../components/Card';
import { Room } from '../types/database';
import PlaylistButton from '../components/PlaylistButton';

export default function AddSongScreen() {
  const [search, setSearch] = useState("")

  const firebase = useContext(FirebaseContext)
  const [rooms, setRooms] = useState<Room[]>([])

  return (
    <ScrollView contentContainerStyle={styles.container} m={5}>
      <Card>
        <Input
          value={search}
          onChangeText={setSearch}
          InputLeftElement={
            <Icon as={<Ionicons name="search" />} size={5} ml="2" color="muted.400" />
          }
          placeholder="What are we listening to ?" />
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
