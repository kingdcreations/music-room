import { createContext, useContext, useEffect, useState } from 'react';
import { Room, TrackData } from '../types/data';
import AudioController from '../components/AudioController';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { MUSIC_ROOM_API } from '@env'
import { onValue, ref } from 'firebase/database';
import { useFirebase } from './FirebaseProvider';
import { AudioContextType } from '../types/AudioContextType';

const AudioContext = createContext<AudioContextType>(null!)

export const useAudio = () => {
    const audioContext = useContext(AudioContext);
    if (!audioContext) throw new Error(
        "useAudio has to be used within <AudioContext.Provider>"
    );
    return audioContext;
};

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    // Private
    const firebase = useFirebase()
    const [sound, setSound] = useState<Audio.Sound>(new Audio.Sound());

    // Public
    const [data, setData] = useState<TrackData | null>(null)
    const [room, setRoom] = useState<Room | null>(null)

    const join = (room: Room) => setRoom(room)

    const quit = () => {
        // Close player and unload
        setRoom(null)
        setData(null)
        sound.unloadAsync()
    }

    // Init audio provider
    useEffect(() => {
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        })
    }, []);

    // Load current song if room joined
    useEffect(() => {
        if (room) {
            const q = ref(firebase.database, `playlists/${room.id}/currentSong`)
            return onValue(q, (dataSnapshot) => {
                if (dataSnapshot.exists()) {
                    fetch(`http://${MUSIC_ROOM_API}:3000/room/${room.id}`)
                        .then((res) => res.json())
                        .then(({ currentSong, currentTime }) => {
                            if (currentSong && currentTime) {
                                setData({ track: currentSong, startTime: currentTime })
                            }
                        })
                } else setData(null)
            })
        }
    }, [room])

    // Play current song if available
    useEffect(() => {
        if (data) Audio.Sound.createAsync(
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
                        setData(null)
                    }
                }
            })
            .then(({ sound: newSound }) => setSound(newSound))
            .catch(e => console.error(e))

        // Unload sound
        return () => { sound?.unloadAsync() }
    }, [data]);

    const value = { join, quit, data, room }
    return (
        <AudioContext.Provider value={value}>
            {children}
            <AudioController {...value} />
        </AudioContext.Provider>
    );
}