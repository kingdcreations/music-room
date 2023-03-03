import { Keyboard, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Avatar, HStack, Icon, IconButton, Spinner, Text, VStack } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HomeStackScreenProps } from '../../types/navigation';
import Input from '../../components/Input';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { User } from '../../types/data';
import Colors from '../../constants/Colors';
import { useFirebase } from '../../providers/FirebaseProvider';
import Container from '../../components/Container';

export default function AddUserScreen({
  route, navigation
}: HomeStackScreenProps<'AddUser'>) {
  const firebase = useFirebase()

  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addUserToRoom = (user: User) => {
    firebase.addUserToRoom(user, route.params.room.id)
    navigation.goBack()
  }

  const searchUsers = () => {
    Keyboard.dismiss()
    setIsLoading(true)

    const q = query(collection(firebase.firestore, 'users'), where('email', '==', search))
    getDocs(q)
      .then(dataSnapshot => {
        const users = dataSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as User)
        // Remove already added users and self
        const uniqueUsers = users.filter((user) => {
          return !route.params.users.map(user => user.uid).includes(user.uid) && user.uid !== firebase.auth.currentUser?.uid
        })
        setUsers(uniqueUsers)
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoading(false))
  }

  return (
    <Container>
      <Input
        mb={3}
        w="100%"
        value={search}
        onChangeText={setSearch}
        InputRightElement={
          <IconButton variant="link" onPress={searchUsers} _icon={{
            as: Ionicons,
            size: '5',
            name: "checkmark-outline"
          }} />
        }
        onSubmitEditing={searchUsers}
        placeholder="Add a friend !" />

      <VStack w="100%" alignItems='center' space='4'>
        {!isLoading ? users.map((user: User, i) => (
          <TouchableOpacity key={i} onPress={() => addUserToRoom(user)}>
            <HStack w="100%" space="4" alignItems='center'>
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
              <Icon as={<Ionicons name="add-circle-outline" />} size={5} ml="3" color="white" />
            </HStack>
          </TouchableOpacity>
        ))
          :
          <Spinner accessibilityLabel="Loading posts" />
        }
      </VStack>
    </Container>
  );
}