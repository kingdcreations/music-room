import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AspectRatio, Avatar, Button, Divider, VStack, HStack, IconButton, ScrollView, Text, View, Image } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import SongItem from '../components/SongItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Audio,
} from "expo-av";
import { Track } from '../types/database';
import { onChildAdded, onChildChanged, onChildRemoved, ref } from 'firebase/database';
import { FirebaseContext } from '../providers/FirebaseContext';

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {
  const firebase = useContext(FirebaseContext)
  const [currentSong, setCurrentSong] = useState<Track | null>(null)

  const [sound] = useState(new Audio.Sound())
  const [volume, setVolume] = useState(0)

  const playlist = route.params.room.playlist && Object.values(route.params.room.playlist)

  const addSong = () => {
    navigation.navigate('AddSong', { room: route.params.room })
  }

  const realtimeSongSync = async () => {
    return await fetch(`http://10.0.0.3:3000/room/${route.params.room.id}`)
      .then((res) => res.json())
  }

  const load = async () => {
    const { currentSong, currentTime } = await realtimeSongSync()
    setCurrentSong(currentSong)

    if (currentSong) {
      await sound.loadAsync({ uri: `http://10.0.0.3:3000/song/${currentSong.id}` });
      await sound.playFromPositionAsync(currentTime)
      await sound.setVolumeAsync(0)
    }
  }

  const play = async () => {
    if (currentSong) {
      await sound.setVolumeAsync(1)
      setVolume(1)
    }
  }

  const pause = async () => {
    if (currentSong) {
      await sound.setVolumeAsync(0)
      setVolume(0)
    }
  }

  const stop = async () => {
    await sound.unloadAsync();
    setVolume(0)
  }

  // Load sound on screen focus
  useEffect(() => {
    return navigation.addListener('focus', () => load());
  }, [navigation]);

  // Stop sound on change screen
  useEffect(() => {
    return navigation.addListener('blur', () => stop());
  }, [navigation]);

  // Stop sound on component unload
  useEffect(() => {
    return () => {
      stop()
    }
  }, []);

  useEffect(() => {
    const currentSongRef = ref(firebase.database, 'rooms/' + route.params.room.id + "/currentSong");
    return onChildAdded(currentSongRef, (data, key) => {
    });
  }, [])

  useEffect(() => {
    const currentSongRef = ref(firebase.database, 'rooms/' + route.params.room.id + "/currentSong");
    return onChildRemoved(currentSongRef, () => {
      setCurrentSong(null)
    });
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          {/* Playlist info */}
          <AspectRatio w="50%" bgColor='gray.300' ratio={1}>
            <Image
              src={currentSong?.thumbnailUrl}
              alt="Current song's thumbnail" />
          </AspectRatio>

          <HStack alignItems="center">
            <Avatar marginRight={2} bg="green.500" size="xs" source={{
              uri: route.params.room.owner.photoURL || undefined
            }}>
              {route.params.room.owner.displayName}
            </Avatar>
            <Text fontSize={12}>{route.params.room.owner.displayName}</Text>
          </HStack>

          {/* Controls */}
          <HStack alignItems="center">
            <IconButton variant="link" _icon={{
              as: Ionicons,
              size: '5',
              name: "person-add-outline"
            }} />
            {volume ?
              <IconButton onPress={pause} size='40px' variant="solid" _icon={{
                as: Ionicons,
                name: "stop-outline"
              }} />
              :
              <IconButton onPress={play} size='40px' variant="solid" _icon={{
                as: Ionicons,
                name: "play-outline"
              }} />}
            <IconButton onPress={addSong} variant="link" _icon={{
              as: Ionicons,
              size: '5',
              name: "add-circle-outline"
            }} />
          </HStack>

          {currentSong && <SongItem song={currentSong} playing />}

          {/* Playlist songs */}
          <Divider />
          <VStack space={3} marginBottom={5} divider={<Divider />} w="100%">
            {playlist && playlist.map((song, id) => <SongItem song={song} key={id} />)}
          </VStack>
          <Button onPress={addSong}>Add a song</Button>
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
