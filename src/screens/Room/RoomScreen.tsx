import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AspectRatio, Avatar, Button, Divider, VStack, HStack, IconButton, ScrollView, Text, View, Image } from 'native-base';
import Card from '../../components/Card';
import { HomeStackScreenProps } from '../../types';
import SongItem from '../../components/SongItem';
import { Track } from '../../types/database';
import { onValue, ref, query, orderByChild } from 'firebase/database';
import { FirebaseContext } from '../../providers/FirebaseProvider';
import { useAudio } from '../../providers/AudioProvider';
import Colors from '../../constants/Colors';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {
  const firebase = useContext(FirebaseContext)
  const audio = useAudio()
  const [currentSong, setCurrentSong] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])

  const room = route.params.room
  const uid = firebase.auth.currentUser?.uid

  const isOwner = () => room.owner.uid === uid
  const isEditor = () => room.users && uid && Object.keys(room.users).includes(uid)

  const addSong = () => navigation.navigate('AddSong', { room })
  const addUser = () => navigation.navigate('Users', { room })

  // Get current song
  useEffect(() => {
    const q = ref(firebase.database, `playlists/${room.id}/currentSong`)
    return onValue(q, (dataSnapshot) => setCurrentSong(dataSnapshot.val()))
  }, [])

  // Get queue
  useEffect(() => {
    const queueRef = query(ref(firebase.database, `playlists/${room.id}/queue`), orderByChild('vote'));
    return onValue(queueRef, (childSnapshot) => {
      const queue = childSnapshot.val()
      setQueue(queue ? () => {
        const tmpQueue: Track[] = []
        childSnapshot.forEach((data) => {
          var song = data.val() as Track
          if (data.key) song.roomId = data.key
          tmpQueue.unshift(song)
        })
        return tmpQueue
      } : [])
    });
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          {/* Playlist info */}
          <AspectRatio w="50%" bgColor={Colors.card} borderWidth={1} borderColor={Colors.border} ratio={1}>
            {currentSong ? <Image
              src={currentSong.thumbnailUrl}
              alt="Current song's thumbnail" />
              :
              <View justifyContent='center' alignItems='center'>
                <MaterialCommunityIcons name="sleep" size={50} color="white" />
              </View>}
          </AspectRatio>

          <HStack mb={3} alignItems="center">
            <Avatar marginRight={2} size="xs" source={{
              uri: room.owner.photoURL || undefined
            }}>
              {room.owner.displayName}
            </Avatar>
            <Text fontSize={12}>{room.owner.displayName}</Text>
          </HStack>

          {/* Controls */}
          <Divider />

          <HStack w='100%' alignItems="center" justifyContent="space-between">
            <HStack alignItems="center">
              <IconButton mr={2} isDisabled={!isEditor() && !isOwner()} onPress={addSong} variant="outline" _icon={{
                as: MaterialCommunityIcons,
                size: '5',
                name: "music-note-plus"
              }} />
              {isOwner() && (room.private || room.privateEdition || room.privateVoting) && <IconButton onPress={addUser} variant="link" _icon={{
                as: MaterialIcons,
                size: '5',
                name: "person-add-alt-1"
              }} />}
              {/* {isOwner() && room.private && <IconButton variant="link" _icon={{
                as: MaterialCommunityIcons,
                size: '5',
                name: "trash-can"
              }} />} */}
            </HStack>

            {audio.room?.id === room.id ?
              <IconButton onPress={audio.quit} size='40px' variant="solid" _icon={{
                as: Ionicons,
                name: "stop-outline"
              }} />
              :
              <IconButton onPress={() => audio.join(room)} size='40px' variant="solid" _icon={{
                as: Ionicons,
                name: "play-outline"
              }} />}
          </HStack>

          {/* Playlist songs */}
          <VStack space={3} marginBottom={5} divider={<Divider />} w="100%">
            {currentSong && <SongItem song={currentSong} playing roomId={room.id} />}
            {queue.map((song, id) => <SongItem song={song} key={id} roomId={room.id} />)}
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
