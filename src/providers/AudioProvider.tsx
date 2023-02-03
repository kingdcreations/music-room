import { createContext, useEffect, useState } from 'react';
import { Room, Track, TrackData } from '../types/database';
import AudioController from '../components/AudioController';
import { Audio } from 'expo-av';
import { MUSIC_ROOM_API } from '@env'

export const AudioContext = createContext<AudioContextType | undefined>(undefined)

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound>();
    const [data, setData] = useState<TrackData | null>(null)
    const [room, setRoom] = useState<Room | null>(null)

    const stop = async () => {
        console.log('Unloading sound from stop()');
        sound?.unloadAsync()
        setData(null)
        setRoom(null)
    }

    const play = (track: Track, startTime: number, room: Room) => {
        setData({ track, startTime })
        setRoom(room)
    }

    useEffect(() => {
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: false,
        })
    }, []);

    useEffect(() => {
        const playSong = async () => {
            if (data) {
                console.log("Load song " + data.track.songId);
                const { sound } = await Audio.Sound.createAsync({
                    uri: `http://${MUSIC_ROOM_API}:3000/song/${data.track.songId}`
                })
                sound.setOnPlaybackStatusUpdate(playbackStatus => {
                    if (playbackStatus.isLoaded) {
                        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                            console.log('Ended ' + data?.track.songId);
                            setData(null)
                        }
                    }
                })
                setSound(sound);
                await sound.playFromPositionAsync(data.startTime)
            }
        }
        playSong()

        // Unload sound
        return () => {
            console.log('Unloading sound from useEffect');
            sound?.unloadAsync()
        }
    }, [data]);

    const value = { play, stop, sound, data, room }
    return (
        <AudioContext.Provider value={value}>
            {children}
            <AudioController {...value} />
        </AudioContext.Provider>
    );
}

export type AudioContextType = {
    data: TrackData | null;
    room: Room | null;
    sound: Audio.Sound | undefined;
    play: (track: Track, startTime: number, room: Room) => (void);
    stop: () => Promise<void>;
}