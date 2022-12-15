import React, { useEffect, useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FirebaseContext } from '../providers/FirebaseContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen'
import SigninScreen from '../screens/SigninScreen'
import RecoverScreen from '../screens/RecoverScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
    const [user, setUser] = useState<User | null>(null);
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        if (firebase?.auth)
            return onAuthStateChanged(firebase.auth, (u) => setUser(u));
    }, []);

    return (
        <NavigationContainer>
            {user ?
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
                :
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signin" component={SigninScreen} />
                    <Stack.Screen name="Recover" component={RecoverScreen} />
                </Stack.Navigator>
            }
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}