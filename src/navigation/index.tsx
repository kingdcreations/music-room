import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
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
import VerificationScreen from '../screens/Auth/VerificationScreen';
import { IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootStack = createBottomTabNavigator<RootStackParamList>();

export default function Navigation() {
    const firebase = useFirebase()

    const logout = () =>
      Alert.alert(
        "Confirmation",
        "Log out ?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            onPress: () => signOut(firebase.auth)
          }
        ]
      );

    const theme = {
        dark: true,
        colors
    };

    if (firebase.user && firebase.user.emailVerified) return (
        <NavigationContainer theme={theme}>
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
                <RootStack.Screen name="Account" component={AccountScreen} options={{
                    headerRight: () => (
                        <IconButton mr={2} onPress={logout} colorScheme="error" variant="link" _icon={{
                            as: MaterialIcons,
                            size: '5',
                            name: "logout",
                        }} />
                    ),
                }}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    )
    else if (firebase.user) return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
                <Stack.Screen name="Verification" component={VerificationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
    else return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signin" component={SigninScreen} />
                <Stack.Screen name="Recover" component={RecoverScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}