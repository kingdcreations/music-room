import { useNavigation } from '@react-navigation/native';
import { onValue, ref } from 'firebase/database';
import { AspectRatio, Image, Text, View } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { Room } from '../types/database';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PlaylistButton({ room }: { room: Room }) {
    const navigation = useNavigation()
    const firebase = useContext(FirebaseContext)
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
                {room.private && <View top={3} right={3} position={'absolute'} zIndex={5}>
                    <MaterialCommunityIcons name="lock" size={25} color="grey" />
                </View>}
                <AspectRatio
                    w="100%"
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