import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NewRoomScreen from '../screens/NewRoomScreen';
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
        options={({ route }) => ({ title: route.params.room.name })}
      />
      <HomeStack.Screen
        name="NewRoom"
        component={NewRoomScreen}
        options={{
          title: 'New Room',
        }}
      />
    </HomeStack.Navigator>
  );
}