import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { Avatar, HStack, Icon, IconButton, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FirebaseContext } from '../providers/FirebaseProvider';
import { HomeStackScreenProps } from '../types';
import Input from '../components/Input';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { User } from '../types/database';
import Colors from '../constants/Colors';

export default function AddUserScreen({
  route, navigation
}: HomeStackScreenProps<'AddUser'>) {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const firebase = useContext(FirebaseContext)

  const addUserToRoom = (user: User) => {
    firebase.addUserToRoom(user, route.params.room.id)
    navigation.goBack()
  }

  const searchUsers = () => {
    Keyboard.dismiss()
    setIsLoading(true)

    const q = query(collection(firebase.firestore, 'users'), where('mail', '==', search))
    getDocs(q)
      .then(dataSnapshot => {
        setUsers(dataSnapshot.docs.map((doc) => ({uid: doc.id, ...doc.data()}) as User))
  })
      .catch (error => console.log(error))
      .finally(() => setIsLoading(false))
}

fetch

return (
  <View style={styles.container}>
    <Input
      mx={5}
      my={2}
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
    <ScrollView w="100%">
      <VStack w="100%" alignItems='center' px={5} py={2} mb={5} space='4'>
        {!isLoading ? users.map((user: User, i) => (
          <TouchableOpacity key={i} onPress={() => addUserToRoom(user)}>
            <HStack w="100%" space="4" alignItems='center'>
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
              <Icon as={<Ionicons name="add-circle-outline" />} size={5} ml="3" color="dark.400" />
            </HStack>
          </TouchableOpacity>
        ))
          :
          <Spinner accessibilityLabel="Loading posts" />
        }
      </VStack>
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
