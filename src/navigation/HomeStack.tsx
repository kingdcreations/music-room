import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NewRoomScreen from '../screens/NewRoomScreen';
import { HomeStackParamList } from '../types';

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
        options={{
          title: 'Home',
        }}
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