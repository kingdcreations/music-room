import { Track } from '../types/database';
import { AspectRatio, Button, Divider, Flex, HStack, Icon, Image, Input, ScrollView, Stack, Text, View, VStack } from 'native-base';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SongItem({song}: { song: Track}) {

    return (
      <View w={{base: '50%', md: '25%'}} p='2'>
        <TouchableOpacity onPress={() => console.log("hey")}>
            <HStack w="100%" space="20" alignItems='center'>
              <Image
              size='sm'
              source={{
                  uri: song.thumbnailUrl
              }} alt="Alternate Text" />
              <Text>{song.title}</Text>
            </HStack>
        </TouchableOpacity>
      </View>
    )
}