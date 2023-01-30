import { VStack } from 'native-base';

export default function Card(props: any) {
    return (
        <VStack
            space={2.5}
            w='100%'
            mb={5}
            justifyContent='center'
            alignItems='center'
            maxWidth='750px'
            {...props}
        />
    )
}