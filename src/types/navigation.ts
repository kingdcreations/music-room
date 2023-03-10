/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Room, User } from './data';

export type RootStackParamList = {
    HomeRoot: NavigatorScreenParams<HomeStackParamList> | undefined;
    Search: undefined;
    Account: undefined;
    Login: undefined;
    Signin: undefined;
    Verification: undefined;
    Recover: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, Screen>;

export type HomeStackParamList = {
    Home: undefined;
    Room: { room: Room };
    Users: { room: Room };
    AddSong: { room: Room };
    AddUser: { users: User[], room: Room };
    AddRoom: undefined;
};

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
    CompositeScreenProps<
        NativeStackScreenProps<HomeStackParamList, Screen>,
        NativeStackScreenProps<RootStackParamList>
    >;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}