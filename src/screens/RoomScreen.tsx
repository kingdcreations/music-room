import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { AspectRatio, Avatar, Button, Divider, VStack, HStack, IconButton, ScrollView, Text, View } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { Room, Track } from '../types/database';
import SongItem from '../components/SongItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Audio,
} from "expo-av";

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {

  const firebase = useContext(FirebaseContext)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const uid = firebase.auth.currentUser?.uid
  const [sound] = useState(new Audio.Sound())
  const [volume, setVolume] = useState(0)


  useEffect(() => {
    if (!uid) return

    const playlistRef = ref(firebase.database, 'rooms/' + route.params.room.id + '/playlist');
    return onValue(playlistRef, (snapshot) => {
      const data = snapshot.val();
      setPlaylist([])
      if (snapshot.exists()) {
        Object.values(data).map((song, i) => setPlaylist((oldSong) => {
          const newSong:Track = song as Track;
          newSong.id = Object.keys(data)[i]
          return [...oldSong, newSong]
        }));
      }
    });    
  }, [])
  
  const addSong = () => {
    navigation.navigate('AddSong', { room: route.params.room })
  }

  const load = async () => {
    await sound.loadAsync({ uri: 'http://10.0.0.3:3000/song/Te3_VlimRw0' });
    await sound.playAsync();
    await sound.setVolumeAsync(0)
  }

  const play = async () => {
    await sound.setVolumeAsync(1)
    setVolume(1)
  }

  const pause = async () => {
    await sound.setVolumeAsync(0)
    setVolume(0)
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

  console.log(route.params.room);
  
  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          {/* Playlist info */}
          <AspectRatio w="50%" ratio={1}>
            <View bgColor='gray.300' w="100%" h="100%">

            </View>
          </AspectRatio>

          <HStack alignItems="center">
            <Avatar marginRight={2} bg="green.500" size="xs" source={{
              uri: route.params.room.owner.photoURL || undefined
            }}>
              {firebase.auth.currentUser?.displayName}
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

          {/* Playlist songs */}
          <Button>Add a song to begin</Button>
          <Text width='100%'>Up Next</Text>
          <Divider />
          <VStack space={3} divider={<Divider />} w="90%">
            {playlist.map((song, id) => <SongItem song={song} key={id}/>)}
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
