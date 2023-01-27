import { useNavigation } from '@react-navigation/native';
import { AspectRatio, HStack, Image, Text, View } from 'native-base';
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
                <AspectRatio w="100%" bgColor='gray.300' ratio={1}>
                    <HStack flexWrap='wrap'>
                        <Image w='50%' h='50%' alt="black" source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png" }} />
                        <Image w='50%' h='50%' alt="red" source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Solid_red.png" }} />
                        <Image w='50%' h='50%' alt="blue" source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Solid_blue.png" }} />
                        <Image w='50%' h='50%' alt="green" source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/2/23/Light_green.PNG" }} />
                    </HStack>
                </AspectRatio>
                <Text textAlign='center' >{room.name}</Text>
            </TouchableOpacity>
        </View>
    )
}