import { Track } from '../types/database';
import { HStack, Image, Text, View, VStack } from 'native-base';
import React from 'react';

export default function SongItem({ song }: { song: Track }) {
  return (
    <View>
      <HStack w="100%" space="4" alignItems='center'>
        <Image
          size='sm'
          source={{
            uri: song.thumbnailUrl
          }} alt="Alternate Text" />
        <VStack flexGrow={1} flexShrink={1}>
          <Text bold isTruncated>{song.title}</Text>
          <Text isTruncated>{song.author}</Text>
        </VStack>
      </HStack>
    </View>
  )
}