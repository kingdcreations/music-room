import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, HStack, ScrollView, Text, View, VStack } from 'native-base';
import { FirebaseContext } from '../../providers/FirebaseProvider';
import { HomeStackScreenProps } from '../../types';
import { Join, User } from '../../types/database';
import Colors from '../../constants/Colors';
import Card from '../../components/Card';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';

export default function UsersScreen({
    route, navigation
}: HomeStackScreenProps<'Users'>) {
    const [users, setUsers] = useState<User[]>([])
    const firebase = useContext(FirebaseContext)

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
        <View style={styles.container}>
            <ScrollView w="100%">
                <Card p="5">
                    <Button w="100%" onPress={addUser}>Add user</Button>
                    <VStack w="100%" alignItems='center' px={5} py={2} mb={5} space='4'>
                        {users.map((user: User, i) => (
                            <HStack key={i} w="100%" space="4" alignItems='center'>
                                <Avatar
                                    size='sm'
                                    bg={Colors.card}
                                    borderColor={Colors.border}
                                    borderWidth={1}
                                    source={{
                                        uri: user?.photoURL
                                    }} />
                                <VStack flexGrow={1} flexShrink={1}>
                                    {user.displayName && <Text isTruncated>{user.displayName}</Text>}
                                    {user.mail && <Text isTruncated>{user.mail}</Text>}
                                </VStack>
                            </HStack>
                        ))}
                    </VStack>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
