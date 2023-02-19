import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AspectRatio, Avatar, Button, Divider, VStack, HStack, IconButton, ScrollView, Text, View, Image, Box } from 'native-base';
import Card from '../../components/Card';
import { HomeStackScreenProps } from '../../types';
import SongItem from '../../components/SongItem';
import { Track } from '../../types/database';
import { onValue, ref, query } from 'firebase/database';
import { FirebaseContext } from '../../providers/FirebaseProvider';
import { useAudio } from '../../providers/AudioProvider';
import Colors from '../../constants/Colors';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps/lib/MapView';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { MapMarker } from 'react-native-maps/lib/MapMarker';
import { MapCircle } from 'react-native-maps/lib/MapCircle';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';
import { getDistance } from 'geolib';

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {
  const firebase = useContext(FirebaseContext)
  const audio = useAudio()
  const [currentSong, setCurrentSong] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const [location, setLocation] = useState<LocationObjectCoords | null>(null)

  const room = route.params.room
  const uid = firebase.auth.currentUser?.uid

  useEffect(() => {
    if (room.custom) (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync();
      setLocation(location.coords)
    })();
  }, [room.custom]);

  const isOwner = () => room.owner.uid === uid
  const isEditor = () => room.users && uid && Object.keys(room.users).includes(uid)
  const isInTimeRange = () => {
    const currentHour = (new Date().getUTCHours() + 1)
    if (room.startTime < room.endTime)
      return room.startTime <= currentHour && currentHour < room.endTime
    else
      return !(room.endTime <= currentHour && currentHour < room.startTime)
  }

  const isInRadius = () => {
    if (!location) return false

    const from = {
      latitude: room.location.latitude,
      longitude: room.location.longitude,
    }
    const to = {
      latitude: location.latitude,
      longitude: location.longitude,
    }
    return getDistance(from, to) < 1000
  }

  const addSong = () => navigation.navigate('AddSong', { room })
  const addUser = () => navigation.navigate('Users', { room })

  const sortSongs = (a: Track, b: Track) => {
    if ((a.votes ? Object.keys(a.votes).length : 0) < (b.votes ? Object.keys(b.votes).length : 0))
      return 1
    else if ((a.votes ? Object.keys(a.votes).length : 0) > (b.votes ? Object.keys(b.votes).length : 0))
      return -1
    return 0
  }

  // Get current song
  useEffect(() => {
    const q = ref(firebase.database, `playlists/${room.id}/currentSong`)
    return onValue(q, (dataSnapshot) => setCurrentSong(dataSnapshot.val()))
  }, [])

  // Get queue
  useEffect(() => {
    const queueRef = query(ref(firebase.database, `playlists/${room.id}/queue`));
    return onValue(queueRef, (childSnapshot) => {
      const queue = childSnapshot.val()
      setQueue(queue ? () => {
        const tmpQueue: Track[] = []
        childSnapshot.forEach((data) => {
          const song = data.val() as Track
          if (data.key) song.roomId = data.key
          tmpQueue.unshift(song)
        })
        return tmpQueue
      } : [])
    });
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView w='100%'>
        <Card p={5}>
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

          {!isOwner() && !isEditor() && room.privateVoting && <HStack alignItems="center" space={3}>
            <MaterialCommunityIcons name="garage-lock" size={25} color="grey" />
            <Text my={2} color="grey">You can only vote if you have been invited to</Text>
          </HStack>}

          {!isOwner() && !isEditor() && room.privateEdition && <HStack alignItems="center" space={3}>
            <MaterialCommunityIcons name="upload-lock" size={25} color="grey" />
            <Text my={2} color="grey">You can only add songs if you have been invited to</Text>
          </HStack>}

          {!room.privateVoting && room.custom &&
            <>
              {!isInTimeRange() && <HStack alignItems="center" space={3}>
                <MaterialCommunityIcons name="calendar-clock" size={25} color="grey" />
                <Text my={2} color="grey">You can only vote between <Text bold color="white">{room.startTime}</Text> and <Text bold color="white">{room.endTime}</Text> hours</Text>
              </HStack>}

              <Box h={200} w="100%">
                <MapView
                  showsUserLocation
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  region={{
                    ...room.location,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  focusable
                >
                  {room.location && <MapMarker coordinate={room.location} />}
                  {room.location && <MapCircle center={room.location} strokeColor="#ff0000ff" radius={1000} fillColor="#ff000050" />}
                </MapView>
              </Box>

              {!isInRadius() && <Text my={2} textAlign="center" color="grey">
                You must be in the specific area radius to vote
              </Text>}
            </>}

          {/* Controls */}
          <Divider />

          <HStack w='100%' alignItems="center" justifyContent="space-between">
            <HStack alignItems="center">
              <IconButton mr={2} isDisabled={room.privateEdition && !isEditor() && !isOwner()} onPress={addSong} variant="outline" _icon={{
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
            {queue.sort(sortSongs).map((song, id) =>
              <SongItem isDisabled={(!isInTimeRange() || !isInRadius()) && !isEditor() && !isOwner()} song={song} key={id} roomId={room.id} />)}
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
  map: {
    width: '100%',
    height: '100%',
  },
});
