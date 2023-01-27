import { Track } from '../types/database';
import { HStack, Image, Text, View, VStack } from 'native-base';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { update, ref } from 'firebase/database';
import { FirebaseContext } from '../providers/FirebaseProvider';

export default function SongItem({ song, playing, roomId }:
  { song: Track, playing?: boolean, roomId: string }) {

  const firebase = useContext(FirebaseContext)

  const asVoted = () => {
    song.vote += 1;
    const updates: {[id: string]: Track} = {}
    updates['/playlists/' + roomId + '/queue/' + song.dbId] = song
    update(ref(firebase.database), updates);
  }

  return (
    <HStack w="100%" space="4" alignItems='center'>
      <Image
        size='sm'
        source={{
          uri: song.thumbnailUrl
        }} alt="Alternate Text" />
      <VStack flexGrow={1} flexShrink={1}>
        {playing ?
          <Text bold isTruncated color="primary.600">{song.title}</Text>
          :
          <Text bold isTruncated>{song.title}</Text>
        }
        <Text isTruncated>{song.author}</Text>
      </VStack>
      {!playing ?
      <TouchableOpacity onPress={asVoted}>
        <VStack alignItems='center'>
          <Ionicons name='chevron-up-outline' size={20} color="black" />
          <Text mt={-1} >{song.vote}</Text>
        </VStack>
      </TouchableOpacity>
      :
      null
      }
    </HStack>
  )
}