import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../providers/FirebaseContext';
import { Button, ScrollView, Text, View } from 'native-base';
import Card from '../components/Card';
import { HomeStackScreenProps } from '../types';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { Room } from '../types/database';

export default function RoomScreen({
  route, navigation
}: HomeStackScreenProps<'Room'>) {
  const firebase = useContext(FirebaseContext)
  const uid = firebase.auth.currentUser?.uid

  const addSong = () => {
    navigation.navigate('AddSong', {room: route.params.room})
  }

  return (
    <View style={styles.container}>
      <ScrollView w='100%' p={5}>
        <Card>
          <Text width='100%'>Up Next</Text>
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
