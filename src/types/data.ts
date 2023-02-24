import { LocationObjectCoords } from 'expo-location/build/Location.types';

export type Track = {
    roomId?: string,
    songId: string,
    title: string,
    author: string,
    thumbnailUrl: string,
    votes: {[key: string]: boolean}
    startedAt?: number
}

export type TrackData = {
    track: Track,
    startTime: number,
}

export type User = {
    uid: string,
    email: string,
    photoURL?: string,
    displayName?: string,
}

export type Join = {
    roomID: string,
    user: User,
}

export type Room = {
    id: string;
    name: string;
    owner: {
        uid: string,
        displayName: string,
        photoURL: string,
    };
    users?: [{
        [key: string]: boolean
    }]
    private: boolean;
    privateEdition: boolean;
    privateVoting: boolean;
    currentSong?: Track;
    custom: boolean;
    startTime: number;
    endTime: number;
    location: LocationObjectCoords
};
