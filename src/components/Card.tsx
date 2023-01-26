import { VStack } from 'native-base';

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <VStack
            children={children}
            bgColor="white"
            rounded='md'
            space={2.5}
            w='100%'
            mb={5}
            p={5}
            justifyContent='center'
            alignItems='center'
            maxWidth='750px'
        />
    )
}