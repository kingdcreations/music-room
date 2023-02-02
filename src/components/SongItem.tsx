import { Track } from '../types/database';
import { HStack, Image, Text, View, VStack } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { update, ref } from 'firebase/database';
import { FirebaseContext } from '../providers/FirebaseProvider';

export default function SongItem({ song, playing, roomId }:
  { song: Track, playing?: boolean, roomId: string }) {

  const firebase = useContext(FirebaseContext)
  const [voteToggle, setVoteToggle] = useState(false)

  const asVoted = () => {
    if (firebase.auth.currentUser?.uid) {
      const updateSong: { [id: string]: Track } = {};
      let tmpVotes: string[] = song.votes ? song.votes : []

      if (!voteToggle) {
        tmpVotes.push(firebase.auth.currentUser.uid)
        setVoteToggle(true);
      }
      else {
        tmpVotes = tmpVotes.filter((item) => item !== firebase.auth.currentUser?.uid)
        setVoteToggle(false);
      }
      song.vote = tmpVotes.length
      song.votes = tmpVotes;
      updateSong['/playlists/' + roomId + '/queue/' + song.key] = song
      update(ref(firebase.database), updateSong);
    }
  }

  useEffect(() => {
    if (firebase.auth.currentUser?.uid && song.votes)
      setVoteToggle(song.votes.includes(firebase.auth.currentUser.uid))
    else
      setVoteToggle(false);
  }, [song])

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
          {voteToggle !== undefined && !voteToggle ?
            <VStack alignItems='center'>
              <Ionicons name='chevron-up-outline' size={20} color="black" />
              <Text mt={-1} >{song.vote}</Text>
            </VStack>
            :
            <VStack alignItems='center'>
              <Ionicons name='chevron-up' size={20} color="orange" />
              <Text bold={true} mt={-1} >{song.vote}</Text>
            </VStack>
          }
        </TouchableOpacity>
        :
        null
      }
    </HStack>
  )
}