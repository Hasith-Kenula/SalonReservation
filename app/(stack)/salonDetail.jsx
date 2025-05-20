import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const SalonDetail = () => {
    const { name, services, distance, rate, price } = useLocalSearchParams();
    return (
        <SafeAreaView style={Style.mainContainer}>
            <View>
                <Text>SalonDetail</Text>
                <Text>Name: {name}</Text>
                <Text>Services: {services}</Text>
                <Text>Distance: {distance} KM</Text>
                <Text>Rating: {rate}</Text>
                <Text>Price: {price}</Text>
            </View>
        </SafeAreaView>
    )
}
const Style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    button: {
        backgroundColor: '#3586DB',
        paddingVertical: 15,
        borderRadius: 5,
    },
});
export default SalonDetail