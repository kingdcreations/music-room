import { Divider, HStack, Text } from "native-base";

export default function OrDivider() {
    return (
        <HStack my={3} alignItems="center">
            <Divider flexShrink={1} />
            <Text mx={5} color="grey">or</Text>
            <Divider flexShrink={1} />
        </HStack>
    )
}
