import { Track } from '../types/data';
import { HStack, Image, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ref, remove, set } from 'firebase/database';
import Colors from '../constants/Colors';
import { useFirebase } from '../providers/FirebaseProvider';

export default function SongItem({ isDisabled, song, playing, roomId }:
  { isDisabled?: boolean, song: Track, playing?: boolean, roomId: string }) {
  const firebase = useFirebase()

  const [voteToggle, setVoteToggle] = useState(false)

  const vote = () => {
    const uid = firebase.auth.currentUser?.uid
    if (uid) {
      if (!voteToggle) {
        set(ref(firebase.database, `/playlists/${roomId}/queue/${song.roomId}/votes/${uid}`), true)
        setVoteToggle(true);
      } else {
        remove(ref(firebase.database, `/playlists/${roomId}/queue/${song.roomId}/votes/${uid}`));
        setVoteToggle(false);
      }
    }
  }

  useEffect(() => {
    if (firebase.auth.currentUser?.uid && song.votes)
      setVoteToggle(Object.keys(song.votes).includes(firebase.auth.currentUser.uid))
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
        <Text bold isTruncated color={playing ? "primary.600" : null}>{song.title}</Text>
        <Text isTruncated>{song.author}</Text>
      </VStack>

      {!playing && <TouchableOpacity disabled={isDisabled} onPress={vote}>
        {voteToggle !== undefined && !voteToggle ?
          <VStack alignItems='center'>
            {!isDisabled && <Ionicons name='chevron-up-outline' size={20} color="white" />}
            <Text>
              {song.votes && Object.keys(song.votes)?.length || 0}
            </Text>
          </VStack>
          :
          <VStack alignItems='center'>
            <Text color={Colors.primary} bold={true}>
              {song.votes && Object.keys(song.votes)?.length || 0}
            </Text>
            {!isDisabled && <Ionicons name='chevron-down' size={20} color={Colors.primary} />}
          </VStack>
        }
      </TouchableOpacity>}
    </HStack>
  )
}