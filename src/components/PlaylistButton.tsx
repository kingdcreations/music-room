import { useNavigation } from '@react-navigation/native';
import { AspectRatio, Button, Flex, Spacer, Text, View, VStack } from 'native-base';
import { Pressable, TouchableOpacity } from 'react-native';
import { Room } from '../types/database';

export default function PlaylistButton({ room }: { room: Room }) {
    const navigation = useNavigation()

    const openRoom = () => navigation.navigate('HomeRoot', {
        screen: 'Room',
        params: { room }
    })

    return (
        <View w={{base: '50%', md: '25%'}} p='2'>
            <TouchableOpacity onPress={openRoom}>
                <AspectRatio w="100%" ratio={1}>
                    <View bgColor='gray.300' w="100%" h="100%">

                    </View>
                </AspectRatio>
                <Text>{room.name}</Text>
            </TouchableOpacity>
        </View>
    )
}