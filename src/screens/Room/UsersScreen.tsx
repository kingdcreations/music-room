import React, { useEffect, useState } from 'react';
import { Avatar, Button, HStack, Text, VStack } from 'native-base';
import { HomeStackScreenProps } from '../../types/navigation';
import { Join, User } from '../../types/data';
import Colors from '../../constants/Colors';
import Container from '../../components/Container';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { useFirebase } from '../../providers/FirebaseProvider';

export default function UsersScreen({
    route, navigation
}: HomeStackScreenProps<'Users'>) {
    const firebase = useFirebase()

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const q = query(
            ref(firebase.database, 'joins'),
            orderByChild("roomID"),
            equalTo(route.params.room.id))
        return onValue(q, (snapshot) => {
            if (snapshot.exists()) {
                const joins = Object.values(snapshot.val()) as Join[]
                setUsers(joins.map((join) => join.user))
            }
        })
    }, [])

    const addUser = () => navigation.navigate('AddUser', {
        users,
        room: route.params.room,
    })

    return (
        <Container>
            <Button mb={3} w="100%" onPress={addUser}>Add user</Button>

            <VStack w="100%" alignItems='center' space='4'>
                {users.map((user: User, i) => (
                    <HStack key={i} w="100%" space="4" alignItems='center'>
                        <Avatar
                            size='md'
                            bg={Colors.card}
                            borderColor={Colors.border}
                            borderWidth={1}
                            source={{
                                uri: user?.photoURL
                            }} />
                        <VStack flexGrow={1} flexShrink={1}>
                            {user.displayName && <Text isTruncated>{user.displayName}</Text>}
                            {user.email && <Text isTruncated>{user.email}</Text>}
                        </VStack>
                    </HStack>
                ))}
            </VStack>
        </Container>
    );
}