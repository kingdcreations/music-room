import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import { HomeStackParamList } from '../types';
import RoomScreen from '../screens/RoomScreen';
import AddSongScreen from '../screens/AddSongScreen';

export default function HomeStack() {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();

  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="Room"
        component={RoomScreen}
        options={({ route }) => ({ title: route.params.room.name })}
      />
      <HomeStack.Screen
        name="AddSong"
        component={AddSongScreen}
        options={{
          title: 'Add song to playlist',
        }}
      />
      <HomeStack.Screen
        name="AddRoom"
        component={AddRoomScreen}
        options={{
          title: 'New Room',
        }}
      />
    </HomeStack.Navigator>
  );
}