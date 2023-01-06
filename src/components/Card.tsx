import { VStack } from 'native-base';

export default function Card({ children }: { children: JSX.Element | JSX.Element[] }) {
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