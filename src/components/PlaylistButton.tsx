import { useNavigation } from '@react-navigation/native';
import { AspectRatio, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Room } from '../types/database';

export default function PlaylistButton({ room }: { room: Room }) {
    const navigation = useNavigation()

    const openRoom = () => navigation.navigate('HomeRoot', {
        screen: 'Room',
        params: { room }
    })

    return (
        <View w={{ base: '50%', md: '25%' }} p='2'>
            <TouchableOpacity onPress={openRoom}>
                <AspectRatio bgColor='gray.300' w="100%" ratio={1}>

                </AspectRatio>
                <Text>{room.name}</Text>
            </TouchableOpacity>
        </View>
    )
}