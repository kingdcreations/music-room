import { StyleSheet, Switch } from 'react-native';
import { useEffect, useState } from 'react';
import { Box, Button, Divider, Heading, HStack, Text, VStack } from 'native-base';
import Container from '../../components/Container';
import { HomeStackScreenProps } from '../../types/navigation';
import { push, ref, set } from 'firebase/database';
import Input from '../../components/Input';
import HourSelect from '../../components/HourSelect';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { LatLng } from 'react-native-maps/lib/sharedTypes';
import { MapMarker } from 'react-native-maps/lib/MapMarker';
import { MapPressEvent } from 'react-native-maps/lib/MapView.types';
import * as Location from 'expo-location';
import { MapCircle } from 'react-native-maps/lib/MapCircle';
import { useFirebase } from '../../providers/FirebaseProvider';
import { doc, getDoc } from 'firebase/firestore';

export default function AddRoomScreen({
  navigation
}: HomeStackScreenProps<'AddRoom'>) {
  const firebase = useFirebase()

  const [displayName, setDisplayName] = useState(firebase.auth.currentUser?.displayName)
  const [roomName, setRoomName] = useState(firebase.auth.currentUser?.displayName + "'s room")
  const [privateRoom, setPrivate] = useState(false)
  const [privateVoting, setPrivateVoting] = useState(false)
  const [privateEdition, setPrivateEdition] = useState(false)
  const [custom, setCustom] = useState(false)
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [marker, setMarker] = useState<LatLng | null>(null)

  const [startTime, setStartTime] = useState("16")
  const [endTime, setEndTime] = useState("18")

  const onMarkerChange = (e: MapPressEvent) => {
    setMarker(e.nativeEvent.coordinate)
  };

  const createRoom = () => {
    set(push(ref(firebase.database, 'rooms')), {
      name: roomName,
      private: privateRoom,
      privateVoting,
      privateEdition,
      custom,
      startTime: parseInt(startTime),
      endTime: parseInt(endTime),
      owner: {
        uid: firebase.auth.currentUser?.uid,
        displayName,
        photoURL: firebase.auth.currentUser?.photoURL
      },
      location: marker
    })
    navigation.goBack()
  }

  useEffect(() => {

    getDoc(doc(firebase.firestore, `users/${firebase.auth.currentUser?.uid}`))
    .then((snapshotData) => {
      if (snapshotData.exists())
        setDisplayName(snapshotData.data()?.displayName);
        setRoomName(snapshotData.data()?.displayName + "'s room");
    })
    
    if (custom) (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync();
      setRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
      setMarker({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      })
    })();
  }, [custom]);

  return (
    <Container>
      <Input w="100%" onChangeText={setRoomName} value={roomName} placeholder="Room name" />

      <Divider my={5} />

      <VStack w="100%" space={5}>
        <VStack space={3}>
          <Heading size="md">Visibility</Heading>
          <HStack>
            <VStack flexShrink={1}>
              <Heading size="sm">Private</Heading>
              <Text>Invited users will be the only ones who can find the event and vote</Text>
            </VStack>
            <Switch onValueChange={setPrivate} value={privateRoom} />
          </HStack>
        </VStack>

        <VStack space={3}>
          <Heading size="md">Vote license</Heading>
          {!privateRoom &&
            <HStack>
              <VStack flexShrink={1} mr='auto'>
                <Heading size="sm">Private</Heading>
                <Text>
                  Only invited people will we able to vote
                </Text>
              </VStack>
              <Switch onValueChange={setPrivateVoting} value={privateVoting} />
            </HStack>}
          {!privateVoting && <HStack>
            <VStack flexShrink={1} mr='auto'>
              <Heading size="sm">Custom</Heading>
              <Text>
                Only people with met condition we able to vote
              </Text>
            </VStack>
            <Switch onValueChange={setCustom} value={custom} />
          </HStack>}
          {!privateVoting && custom &&
            <VStack>
              <Box h={200} mb={5}>
                <MapView
                  showsUserLocation
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  region={region}
                  onPress={onMarkerChange}
                  focusable
                >
                  {marker && <MapMarker coordinate={marker} />}
                  {marker && <MapCircle center={marker} strokeColor="#ff0000ff" radius={1000} fillColor="#ff000050" />}
                </MapView>
              </Box>
              <HStack alignItems={'center'} space={3}>
                <VStack flexGrow={1} space={2}>
                  <Text>Start time</Text>
                  <HourSelect selectedValue={startTime} placeholder="Start time" onValueChange={setStartTime} />
                </VStack>
                <VStack flexGrow={1} space={2}>
                  <Text>End time</Text>
                  <HourSelect selectedValue={endTime} placeholder="End time" onValueChange={setEndTime} />
                </VStack>
              </HStack>
            </VStack>
          }
        </VStack>

        {!privateRoom &&
          <VStack space={3}>
            <Heading size="md">Edit license</Heading>
            <HStack>
              <VStack flexShrink={1} mr='auto'>
                <Heading size="sm">Private</Heading>
                <Text>
                  Only invited people will we able to edit
                </Text>
              </VStack>
              <Switch onValueChange={setPrivateEdition} value={privateEdition} />
            </HStack>
          </VStack>}
      </VStack>

      <Divider my={5} />

      <Button w="100%" onPress={createRoom}>Create room</Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
