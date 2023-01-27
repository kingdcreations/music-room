import { AspectRatio, HStack, IconButton, Text, VStack, Image, View } from 'native-base';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AudioController(props: any) {
    if (!props.roomID) return null
    return (
        <HStack
            style={styles.container}
            bgColor="gray.300"
            w='100%'
            space={3}
            py={1.5}
            px={3}
        >
            <AspectRatio bgColor='gray.500' h="100%" ratio={1}>
                <Image src={props.data?.thumbnailUrl} alt="Song illustration" />
            </AspectRatio>

            <VStack justifyContent="center">
                <Text fontSize={12} bold isTruncated>{props.data?.title || "Waiting for song..."}</Text>
                <Text fontSize={12} isTruncated>{props.data?.author}</Text>
            </VStack>

            <IconButton onPress={() => props.stop()} marginLeft="auto" size='40px' variant='none' _icon={{
                as: Ionicons,
                size: '25px',
                name: "close"
            }} />
        </HStack>
    )
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
