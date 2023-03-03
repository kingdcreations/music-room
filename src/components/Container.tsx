import { ScrollView, View, VStack } from 'native-base';
import { StyleSheet } from 'react-native';

export default function Container(props: any) {
    return (
        <View style={styles.container}>
            {/* Header */}
            {props.header &&
                <VStack
                    p={5}
                    space={2.5}
                    w='100%'
                    justifyContent='center'
                    alignItems='center'
                    maxWidth='750px'
                >
                    {props.header}
                </VStack>}
            {/* Body */}
            <ScrollView w='100%' maxW={500} contentContainerStyle={[{
                paddingBottom: 50,
                justifyContent: 'center'
            }, props.center && {flexGrow: 1}]}>
                <VStack
                    p={5}
                    space={2.5}
                    w='100%'
                    justifyContent='center'
                    alignItems='center'
                    maxWidth='750px'
                    {...props}
                />
            </ScrollView>
            {/* Footer */}
            {props.footer &&
                <VStack
                    p={5}
                    space={2.5}
                    w='100%'
                    justifyContent='center'
                    alignItems='center'
                    maxWidth='750px'

                >
                    {props.footer}
                </VStack>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
