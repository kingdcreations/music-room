import { Track } from '../types/database';
import { HStack, Image, Text, View, VStack } from 'native-base';
import React from 'react';

export default function SongItem({ song, playing }: { song: Track, playing?: boolean }) {
  return (
    <View>
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
      </HStack>
    </View>
  )
}