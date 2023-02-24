import { createContext, useContext, useEffect, useState } from 'react';
import { Room, Track } from '../types/data';
import AudioController from '../components/AudioController';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { onValue, ref } from 'firebase/database';
import { useFirebase } from './FirebaseProvider';
import { AudioContextType } from '../types/AudioContextType';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

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
    const [data, setData] = useState<Track | null>(null)
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
                if (dataSnapshot.exists()) setData(dataSnapshot.val())
            })
        }
    }, [room])

    // Play current song if available
    useEffect(() => {
        if (!data) return

        getDownloadURL(storageRef(firebase.storage, `${data.songId}.mp3`))
            .then((uri) => {
                Audio.Sound.createAsync(
                    // Initialisation values
                    { uri },
                    {
                        shouldPlay: true,
                        positionMillis: Date.now() - (data.startedAt || 0),
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
            })

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