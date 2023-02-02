import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/Room/AddRoomScreen';
import { HomeStackParamList } from '../types';
import RoomScreen from '../screens/Room/RoomScreen';
import AddSongScreen from '../screens/Room/AddSongScreen';
import AddUserScreen from '../screens/Room/AddUserScreen';
import UsersScreen from '../screens/Room/UsersScreen';

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
        name="Users"
        component={UsersScreen}
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
      <HomeStack.Screen
        name="AddUser"
        component={AddUserScreen}
        options={{
          title: 'Add user',
        }}
      />
    </HomeStack.Navigator>
  );
}