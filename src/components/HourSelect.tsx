import { Select } from "native-base";

export default function HourSelect(props: any) {
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
                <Select.Item key={hour} label={hour.toString() + 'h'} value={hour.toString()} />)}
        </Select>
    )
}