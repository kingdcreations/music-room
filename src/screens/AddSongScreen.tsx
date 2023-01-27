import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { Button, HStack, Icon, Image, Input, ScrollView, Text, View, VStack } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FirebaseContext } from '../providers/FirebaseContext';
import { FIREBASE_API_KEY } from '@env';
import { Track } from '../types/database';
import { HomeStackScreenProps } from '../types';


export default function AddSongScreen({
  route
}: HomeStackScreenProps<'AddSong'>) {
  const [search, setSearch] = useState("")
  const [tracks, setTracks] = useState([])

  const firebase = useContext(FirebaseContext)

  const addToPlaylist = (track: any) => {
    var newtrack: Track = {
      id: track.id.videoId,
      title: track.snippet.title,
      author: track.snippet.channelTitle,
      thumbnailUrl: track.snippet.thumbnails.default.url,
    }
    firebase.addSongToPlaylist(newtrack, route.params.room.id)
  }

  const searchTracks = () => {
    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q='
      + encodeURIComponent(search) + '&key=' + FIREBASE_API_KEY)
      .then(response => response.json())
      .then((data) => setTracks(data.items))
      .catch(error => console.log(error))
  }

  return (
    <View style={styles.container}>
      <Input
        py={3}
        value={search}
        onChangeText={setSearch}

        InputLeftElement={
          <Icon as={<Ionicons name="search" />} size={5} ml="3" color="muted.400" />
        }
        placeholder="What are we listening to ?" />
      <Button onPress={searchTracks}>Search</Button>
      <ScrollView w="100%">
        <VStack w="100%" alignItems='center' p={4} space='4'>
          {tracks.map((track: any, i) => (
            <TouchableOpacity key={i} onPress={() => addToPlaylist(track)}>
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
                <Icon as={<Ionicons name="add-circle-outline" />} size={5} ml="3" color="dark.400" />
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
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
