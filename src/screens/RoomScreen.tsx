import { StyleSheet } from 'react-native';
import { VStack, HStack, Icon, Divider } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { Button, ScrollView, Text, View } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { Room, Track } from '../types/database';
import SongItem from '../components/SongItem';

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {

  const firebase = useContext(FirebaseContext)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const uid = firebase.auth.currentUser?.uid

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
    navigation.navigate('AddSong', {room: route.params.room})
  }

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          <Text width='100%'>Up Next</Text>
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
