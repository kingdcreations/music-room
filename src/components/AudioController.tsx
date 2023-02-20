import { AspectRatio, HStack, IconButton, Text, VStack, Image, View } from 'native-base';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AudioContextType } from '../types/AudioContextType';

export default function AudioController({ data, room, quit }: AudioContextType) {
    if (!room) return null
    return (
        <HStack
            style={styles.container}
            bgColor="coolGray.900:alpha.90"
            w='100%'
            space={3}
            py={1.5}
            px={3}
        >
            <AspectRatio bgColor={Colors.background} h="100%" ratio={1}>
                {data ?
                    <Image src={data.track.thumbnailUrl} alt="Song illustration" />
                    :
                    <View justifyContent='center' alignItems='center'>
                        <MaterialCommunityIcons name="sleep" size={20} color="white" />
                    </View>}
            </AspectRatio>

            <VStack justifyContent="center" flexGrow={0} flexShrink={1}>
                <Text fontSize={12} bold isTruncated>{data?.track.title || "Waiting for song..."}</Text>
                {data?.track.author && <Text fontSize={12} isTruncated>{data?.track.author}</Text>}
            </VStack>

            <IconButton onPress={quit} marginLeft="auto" size='40px' variant='none' _icon={{
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
        bottom: 60,
    },
});
