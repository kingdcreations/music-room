import { createContext, useEffect, useState } from 'react';
import { Room, Track, TrackData } from '../types/database';
import AudioController from '../components/AudioController';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { MUSIC_ROOM_API } from '@env'

export const AudioContext = createContext<AudioContextType | undefined>(undefined)

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound>(new Audio.Sound());
    const [data, setData] = useState<TrackData | null>(null)
    const [room, setRoom] = useState<Room | null>(null)

    const stop = async () => {
        console.log('Unloading sound from stop()');
        sound?.unloadAsync()
        setData(null)
        setRoom(null) // Close player
    }

    const play = (track: Track, startTime: number, room: Room) => {
        setData({ track, startTime })
        setRoom(room)
    }

    useEffect(() => {
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        })
    }, []);

    useEffect(() => {
        const playSong = async () => {
            if (data) {
                try {
                    sound.unloadAsync()
                    console.log("Load song " + data.track.songId);
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        // Source
                        { uri: `http://${MUSIC_ROOM_API}:3000/song/${data.track.songId}` },
                        // Initialisation values
                        {
                            shouldPlay: true,
                            positionMillis: data.startTime,
                        },
                        // Events
                        (playbackStatus) => {
                            if (playbackStatus.isLoaded) {
                                
                                // Sound ended
                                if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                                    console.log('Ended ' + data?.track.songId);
                                    sound?.unloadAsync()
                                    setData(null)
                                }
                            }
                        })
                    setSound(newSound);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        playSong()

        // Unload sound
        return () => {
            console.log('Unloading sound from useEffect');
            sound?.unloadAsync()
        }
    }, [data]);

    const value = { play, stop, data, room }
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
    play: (track: Track, startTime: number, room: Room) => (void);
    stop: () => Promise<void>;
}