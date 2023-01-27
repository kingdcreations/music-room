import { AspectRatio, HStack, IconButton, Image, Text, VStack } from 'native-base';
import { createContext } from 'react';
import AudioPlayer from './AudioContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

const audio = new AudioPlayer()
export const AudioContext = createContext(audio)

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    console.log(audio);
    

    return (
        <AudioContext.Provider value={audio}>
            {children}

            <HStack
                style={styles.container}
                bgColor="gray.300"
                w='100%'
                space={3}
                py={1.5}
                px={3}
            >
                <AspectRatio bgColor='gray.500' h="100%" ratio={1}>
                    <Image src={audio.data?.thumbnailUrl} alt="Song illustration" />
                </AspectRatio>

                <VStack justifyContent="center">
                    <Text fontSize={12} bold isTruncated>{audio.data?.title}</Text>
                    <Text fontSize={12} isTruncated>{audio.data?.author}</Text>
                    <Text fontSize={12} isTruncated>{JSON.stringify(audio.data)}</Text>
                </VStack>

                <IconButton onPress={audio.stop} marginLeft="auto" size='40px' variant='none' _icon={{
                    as: Ionicons,
                    size: '25px',
                    name: "close"
                }} />
            </HStack>

        </AudioContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 50,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 5,
        bottom: 50,
    },
});