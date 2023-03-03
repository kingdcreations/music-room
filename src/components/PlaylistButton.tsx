import { useNavigation } from '@react-navigation/native';
import { onValue, ref } from 'firebase/database';
import { AspectRatio, Image, Text, View, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Room } from '../types/data';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFirebase } from '../providers/FirebaseProvider';

export default function PlaylistButton({ room }: { room: Room }) {
    const firebase = useFirebase()
    const navigation = useNavigation()

    const [thumbnail, setThumbnail] = useState(null)

    const openRoom = () => navigation.navigate('HomeRoot', {
        screen: 'Room',
        params: { room }
    })

    useEffect(() => {
        onValue(ref(firebase.database, `playlists/${room.id}/currentSong`), data => {
            setThumbnail(data.exists() ? data.val().thumbnailUrl : null)
        })
    }, [])

    return (
        <View p={2} w={{ base: '50%', md: '25%' }}>
            <TouchableOpacity onPress={openRoom}>
                <VStack top={3} right={3} position={'absolute'} zIndex={5} space={2}>
                    {room.private && <MaterialCommunityIcons name="lock" size={25} color="grey" />}
                    {room.privateEdition && <MaterialCommunityIcons name="upload-lock" size={25} color="grey" />}
                    {room.privateVoting && <MaterialCommunityIcons name="garage-lock" size={25} color="grey" />}
                    {!room.privateVoting && room.custom && <MaterialCommunityIcons name="calendar-clock" size={25} color="grey" />}
                </VStack>
                <AspectRatio
                    w="100%"
                    minW="100%"
                    borderWidth={1}
                    borderColor={Colors.border}
                    bgColor={Colors.card}
                    ratio={1} mb={3}>
                    {thumbnail ?
                        <Image alt="black" source={{ uri: thumbnail }} />
                        :
                        <View justifyContent='center' alignItems='center'>
                            <MaterialCommunityIcons name="sleep" size={50} color="white" />
                        </View>}
                </AspectRatio>
                <Text textAlign='center' >{room.name}</Text>
            </TouchableOpacity>
        </View>
    )
}