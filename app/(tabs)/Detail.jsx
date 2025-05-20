import { ScrollView, Text } from 'react-native'
import FocusableTextInput from '../../components/FocusableTextInput'

const Detail = () => {
    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{ marginHorizontal: 10, height: '100%' }}>
            <Text>Detail</Text>
            <FocusableTextInput placeholder="Enter you Name" />
        </ScrollView>
    )
}

export default Detail