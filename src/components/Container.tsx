import { ScrollView, View, VStack } from 'native-base';
import { StyleSheet } from 'react-native';

export default function Container(props: any) {
    return (
        <View style={styles.container}>
            <ScrollView w='100%' contentContainerStyle={{
                paddingBottom: 50
            }}>
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
