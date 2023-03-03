import { useState, useEffect } from 'react';
import { Divider, HStack, Text, VStack } from "native-base";
import { useFirebase } from '../providers/FirebaseProvider';
import { onValue, ref } from 'firebase/database';
import { Device } from '../types/data';
import Colors from '../constants/Colors';

export default function Devices() {
    const firebase = useFirebase()
    const [devices, setDevices] = useState<Device[]>([])

    // Get current song
    useEffect(() => {
        if (!firebase.user) return

        const q = ref(firebase.database, `devices/${firebase.user.uid}/connections`)
        return onValue(q, (dataSnapshot) => {
            if (dataSnapshot.exists())
                setDevices(Object.values(dataSnapshot.val()))
            else setDevices([])
        })
    }, [])


    return (devices && devices.length !== 0) ? (
        <>
            <Divider my={3} />
            <Text w='100%' mb={3} bold>Your devices</Text>
            <VStack w="100%" bg={Colors.card} p={5} rounded={5}>
                <HStack mb={3}>
                    <Text w="60%" bold>Device name</Text>
                    <Text w="40%" bold>Platform</Text>
                </HStack>
                {devices.map((device, i) => <HStack key={i}>
                    <Text w="60%">{device.deviceName}</Text>
                    <Text w="40%">{device.os}</Text>
                </HStack>)}
            </VStack>
        </>
    ) : null
}