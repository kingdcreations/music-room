import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AspectRatio, Avatar, Button, Divider, VStack, HStack, IconButton, ScrollView, Text, View, Image } from 'native-base';
import Card from '../../components/Card';
import { HomeStackScreenProps } from '../../types';
import SongItem from '../../components/SongItem';
import { Track } from '../../types/database';
import { onValue, ref, query, orderByChild } from 'firebase/database';
import { FirebaseContext } from '../../providers/FirebaseProvider';
import { AudioContext } from '../../providers/AudioProvider';
import Colors from '../../constants/Colors';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MUSIC_ROOM_API } from '@env'

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {
  const firebase = useContext(FirebaseContext)
  const audio = useContext(AudioContext)
  const [currentSong, setCurrentSong] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])

  const play = async () => {
    const { currentSong, currentTime } = await fetch(`http://${MUSIC_ROOM_API}:3000/room/${route.params.room.id}`)
      .then((res) => res.json())

    if (currentSong) {
      audio?.play(currentSong, currentTime, route.params.room)
      setCurrentSong(currentSong)
    }
  }

  const stop = async () => await audio?.stop()

  const addSong = () => navigation.navigate('AddSong', { room: route.params.room })
  const addUser = () => navigation.navigate('Users', { room: route.params.room })

  // Update songs
  useEffect(() => {
    const currentSongRef = ref(firebase.database, 'playlists/' + route.params.room.id + '/currentSong');
    return onValue(currentSongRef, (childSnapshot) => {
      const song = childSnapshot.val()
      setCurrentSong(song)
      if (audio?.room?.id === route.params.room.id) play()
    });
  }, [audio?.room?.id])

  // Update queue
  useEffect(() => {
    const queueRef = query(ref(firebase.database, 'playlists/' + route.params.room.id + '/queue'), orderByChild('vote'));
    return onValue(queueRef, (childSnapshot) => {
      const queue = childSnapshot.val()
      setQueue(queue ? () => {
        const tmpqueue: Track[] = []
        childSnapshot.forEach((data) => {
          var song = data.val() as Track
          tmpqueue.unshift(song)
        })
        return tmpqueue
      } : [])
    });
  }, [])

  const isOwner = () => route.params.room.owner.uid === firebase.auth.currentUser?.uid

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          {/* Playlist info */}
          <AspectRatio w="50%" bgColor={Colors.card} borderWidth={1} borderColor={Colors.border} ratio={1}>
            {currentSong ? <Image
              src={currentSong?.thumbnailUrl}
              alt="Current song's thumbnail" />
              :
              <View justifyContent='center' alignItems='center'>
                <MaterialCommunityIcons name="sleep" size={50} color="white" />
              </View>}
          </AspectRatio>

          <HStack mb={3} alignItems="center">
            <Avatar marginRight={2} size="xs" source={{
              uri: route.params.room.owner.photoURL || undefined
            }}>
              {route.params.room.owner.displayName}
            </Avatar>
            <Text fontSize={12}>{route.params.room.owner.displayName}</Text>
          </HStack>

          {/* Controls */}
          <Divider />

          <HStack w='100%' alignItems="center" justifyContent="space-between">
            <HStack alignItems="center">
              <IconButton mr={2} onPress={addSong} variant="outline" _icon={{
                as: MaterialCommunityIcons,
                size: '5',
                name: "music-note-plus"
              }} />
              {isOwner() && route.params.room.private && <IconButton onPress={addUser} variant="link" _icon={{
                as: MaterialIcons,
                size: '5',
                name: "person-add-alt-1"
              }} />}
              {isOwner() && route.params.room.private && <IconButton variant="link" _icon={{
                as: MaterialCommunityIcons,
                size: '5',
                name: "trash-can"
              }} />}
              <IconButton variant="link" _icon={{
                as: MaterialCommunityIcons,
                size: '5',
                name: "share-variant"
              }} />
            </HStack>

            {audio?.room?.id === route.params.room.id ?
              <IconButton onPress={stop} size='40px' variant="solid" _icon={{
                as: Ionicons,
                name: "stop-outline"
              }} />
              :
              <IconButton isDisabled={currentSong === null} onPress={play} size='40px' variant="solid" _icon={{
                as: Ionicons,
                name: "play-outline"
              }} />}
          </HStack>

          {/* Playlist songs */}
          <VStack space={3} marginBottom={5} divider={<Divider />} w="100%">
            {currentSong && <SongItem song={currentSong} playing roomId={route.params.room.id} />}
            {queue.map((song, id) => <SongItem song={song} key={id} roomId={route.params.room.id} />)}
          </VStack>
          {queue.length !== 0 && <Button onPress={addSong}>Add a song</Button>}
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
