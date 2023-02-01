import { Input as InputNB } from 'native-base';

export default function Input(props: any) {
    return (
        <InputNB
            color="black"
            bg='coolGray.100'
            _hover={{
                bg: "coolGray.100"
            }}
            _focus={{
                bg: "coolGray.100:alpha.90"
            }}
            {...props} />
    );
}