import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AspectRatio, Button, Flex, HStack, Icon, Image, Input, ScrollView, Stack, Text, View, VStack } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FirebaseContext } from '../providers/FirebaseContext';
import SpotifyWebApi from "spotify-web-api-node";

export default function AddSongScreen() {
  const [search, setSearch] = useState("")
  const [tracks, setTracks] = useState([])

  const firebase = useContext(FirebaseContext)

  var client_id = 'fed4ddbb4f654f368d9661a7384a656a';
  var client_secret = '4a1b01a42deb48838639fed497f898a8';

  var spotifyApi = new SpotifyWebApi();

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
    .then(r => r.json())
    .then(r => {
      spotifyApi.setAccessToken(r.access_token);
    })

  const searchTracks = () => {
    spotifyApi.searchTracks('track:' + search, { limit: 10 }).then(
      function (data) {
        console.log(data.body.tracks.items[0].id);
        
        setTracks(data.body.tracks.items)
      },
      function (err) {
        console.error(err);
      }
    );
  }

  return (
    <View style={styles.container}>
      <Input
        py={3}
        value={search}
        onChangeText={setSearch}
        onEndEditing={searchTracks}
        InputLeftElement={
          <Icon as={<Ionicons name="search" />} size={5} ml="3" color="muted.400" />
        }
        placeholder="What are we listening to ?" />

      <ScrollView w="100%">
        <VStack w="100%" alignItems='center' p={4} space='4'>
          {tracks.map((track, i) => (
            <TouchableOpacity key={i} onPress={() => addToPlaylist()}>
              <HStack w="100%" space="4" alignItems='center'>
                <Image
                  size='sm'
                  source={{
                    uri: track.album.images[0].url
                  }} alt="Alternate Text" />
                <VStack flexGrow={1} flexShrink={1}>
                  <Text bold isTruncated>{track.name}</Text>
                  <Text isTruncated>{track.artists.map((artist) => artist.name).join(', ')}</Text>
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
