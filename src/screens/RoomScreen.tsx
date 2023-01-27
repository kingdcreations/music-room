import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState, useRef } from 'react';
import { AspectRatio, Avatar, Button, Divider, VStack, HStack, IconButton, ScrollView, Text, View, Image } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import SongItem from '../components/SongItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from "expo-av";
import { Track } from '../types/database';
import { onValue, ref, query, orderByChild } from 'firebase/database';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { AudioContext } from '../providers/AudioProvider';

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {
  const firebase = useContext(FirebaseContext)
  const audio = useContext(AudioContext)
  const [currentSong, setCurrentSong] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])

  const [volume, setVolume] = useState(0)

  console.log(audio);

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
      try {
        // await sound.unloadAsync();
        // await sound.loadAsync({ uri: `http://10.0.0.3:3000/song/${currentSong.id}` });
        // await sound.playFromPositionAsync(currentTime)
        // await sound.setVolumeAsync(1)
      } catch (e) {
        console.log(e);
      }
    }
  }

  const play = async () => {
    audio.play(currentSong)
  }

  const pause = async () => {
    // if (currentSong) {
    //   await sound.setVolumeAsync(0)
    //   setVolume(0)
    // }
  }

  const stop = async () => {
    // await sound.unloadAsync();
    // setVolume(0)
  }

  // Stop sound on component unload
  useEffect(() => {
    return () => {
      stop()
    }
  }, []);

  // Update songs
  useEffect(() => {
    const currentSongRef = ref(firebase.database, 'playlists/' + route.params.room.id + '/currentSong');
    return onValue(currentSongRef, (childSnapshot) => {
      const song = childSnapshot.val()
      setCurrentSong(song)
      if (song) load()
    });
  }, [])

  // Update queue
  useEffect(() => {
    const queueRef = query(ref(firebase.database, 'playlists/' + route.params.room.id + '/queue'), orderByChild('vote'));
    return onValue(queueRef, (childSnapshot) => {
      const queue = childSnapshot.val()
      setQueue(queue ? () => {
        const tmpqueue:Track[] = []
        childSnapshot.forEach((data) => {
          var song = data.val() as Track
          song.dbId = data.key ? data.key : undefined;
          tmpqueue.unshift(song)
        })
        return tmpqueue
      } : [])
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


          {/* Playlist songs */}
          <VStack space={3} marginBottom={5} divider={<Divider />} w="100%">
            {currentSong && <SongItem song={currentSong} playing roomId={route.params.room.id} />}
            {queue.map((song, id) => <SongItem song={song} key={id} roomId={route.params.room.id} />)}
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
