import { createContext, useEffect, useState } from 'react';
import { Track } from '../types/database';
import AudioController from '../components/AudioController';
import { Audio } from 'expo-av';

export const AudioContext = createContext<
    {
        data: Track | null;
        setData: React.Dispatch<React.SetStateAction<Track | null>>;
        sound: Audio.Sound | undefined;
        play: (currentSong: Track, currentTime: number, roomID: string) => Promise<void>;
        stop: () => Promise<void>;
        roomID: string | null;
    } | undefined
>(undefined)

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    const [sound, setSound] = useState<Audio.Sound>();
    const [roomID, setRoomID] = useState<string | null>(null)
    const [data, setData] = useState<Track | null>(null)

    const stop = async () => {
        sound && await sound.unloadAsync()
        setData(null)
        setRoomID(null)
    }

    const play = async (currentSong: Track, currentTime: number, roomID: string) => {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            if (currentSong) {
                setData(currentSong)
                setRoomID(roomID)
                const { sound } = await Audio.Sound.createAsync({
                    uri: `http://10.0.0.3:3000/song/${currentSong.songId}`
                })
                setSound(sound);
                await sound.playFromPositionAsync(currentTime)
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        sound?.setOnPlaybackStatusUpdate(playbackStatus => {
            if (playbackStatus.isLoaded) {
                if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                    setData(null)
                }
            }
        })

        return sound && (() => {
            sound.unloadAsync();
        })
    }, [sound]);

    const value = { play, stop, roomID, sound, data, setData }
    return (
        <AudioContext.Provider value={value}>
            {children}
            <AudioController {...value} />
        </AudioContext.Provider>
    );
}