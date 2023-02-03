import { Select } from "native-base";

export default function HourSelct(props: any) {
    const hours = Array.from(Array(24).keys())

    return (
        <Select
            flexGrow={1}
            color='black'
            bg='coolGray.100'
            _selectedItem={{
                bg: "primary.600",
            }}
            {...props}>

            {hours.map((hour) =>
                <Select.Item label={hour.toString() + 'h'} value={hour.toString()} />)}
        </Select>
    )
}