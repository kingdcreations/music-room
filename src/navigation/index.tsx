import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import LoginScreen from '../screens/Auth/LoginScreen'
import SigninScreen from '../screens/Auth/SigninScreen'
import RecoverScreen from '../screens/Auth/RecoverScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';
import HomeStack from './HomeStack';
import colors from '../constants/Colors';
import { useFirebase } from '../providers/FirebaseProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootStack = createBottomTabNavigator<RootStackParamList>();

export default function Navigation() {
    const firebase = useFirebase()

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => onAuthStateChanged(firebase.auth, (u) => setUser(u)), []);

    const theme = {
        dark: true,
        colors
    };

    return (
        <NavigationContainer theme={theme}>
            {user ?
                <RootStack.Navigator
                    initialRouteName="HomeRoot"
                    screenOptions={({ route }) => ({
                        tabBarStyle: {
                            height: 60,
                        },
                        tabBarItemStyle: {
                            margin: 7.5,
                        },
                        tabBarIcon: ({ color, size }) => {
                            if (route.name === 'HomeRoot') {
                                return <Ionicons name='home' size={size} color={color} />;
                            }
                            if (route.name === 'Search') {
                                return <Ionicons name='search' size={size} color={color} />;
                            }
                            if (route.name === 'Account') {
                                return <Ionicons name='person-outline' size={size} color={color} />;
                            }
                        },
                    })}>
                    <RootStack.Screen name="Search" component={SearchScreen} />
                    <RootStack.Screen
                        name="HomeRoot"
                        component={HomeStack}
                        options={{
                            headerShown: false,
                            title: 'Home',
                        }} />
                    <RootStack.Screen name="Account" component={AccountScreen} />
                </RootStack.Navigator>
                :
                <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signin" component={SigninScreen} />
                    <Stack.Screen name="Recover" component={RecoverScreen} />
                </Stack.Navigator>
            }
        </NavigationContainer>
    );
}