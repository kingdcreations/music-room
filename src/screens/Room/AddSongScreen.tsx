import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { HStack, Icon, IconButton, Image, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_API_KEY } from '@env';
import { Track } from '../../types/data';
import { HomeStackScreenProps } from '../../types/navigation';
import Input from '../../components/Input';
import { useFirebase } from '../../providers/FirebaseProvider';
import Container from '../../components/Container';

export default function AddSongScreen({
  route, navigation
}: HomeStackScreenProps<'AddSong'>) {
  const firebase = useFirebase()

  const [search, setSearch] = useState("")
  const [tracks, setTracks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addToPlaylist = (track: any) => {
    const newtrack: Track = {
      songId: track.id.videoId,
      title: track.snippet.title,
      author: track.snippet.channelTitle,
      thumbnailUrl: track.snippet.thumbnails.default.url,
      votes: {},
    }
    firebase.addSongToPlaylist(newtrack, route.params.room.id)
    navigation.goBack()
  }

  const searchTracks = () => {
    Keyboard.dismiss()
    setIsLoading(true)
    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q='
      + encodeURIComponent(search) + '&key=' + FIREBASE_API_KEY)
      .then(response => response.json())
      .then(data => setTracks(data.items))
      .catch(e => console.error(e))
      .finally(() => setIsLoading(false))
  }

  return (
    <Container>
      <Input
        mb={3}
        w="100%"
        value={search}
        onChangeText={setSearch}
        InputRightElement={
          <IconButton variant="link" onPress={searchTracks} _icon={{
            as: Ionicons,
            size: '5',
            name: "checkmark-outline"
          }} />
        }
        onSubmitEditing={searchTracks}
        placeholder="What are we listening to ?" />

      <VStack w="100%" alignItems='center' space='4'>
        {!isLoading && tracks ? tracks.map((track: any, i) => (
          <TouchableOpacity style={{width: "100%"}} key={i} onPress={() => addToPlaylist(track)}>
            <HStack w="100%" space="4" alignItems='center'>
              <Image
                size='sm'
                source={{
                  uri: track.snippet.thumbnails.default.url
                }} alt="Alternate Text" />
              <VStack flexGrow={1} flexShrink={1}>
                <Text bold isTruncated>{track.snippet.title}</Text>
                <Text isTruncated>{track.snippet.channelTitle}</Text>
              </VStack>
              <Icon as={<Ionicons name="add-circle-outline" />} size={5} ml="3" color="white" />
            </HStack>
          </TouchableOpacity>
        ))
          :
          <Spinner accessibilityLabel="Loading posts" />
        }
      </VStack>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
