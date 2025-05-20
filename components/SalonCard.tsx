import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SalonCardProps = {
    name: string;
    services: string;
    distance: number;
    rate: number;
    price: string;
};

const SalonCard = (prop: SalonCardProps) => {
    // const navigation: any = useNavigation();
    const router = useRouter();
    return (
        <TouchableOpacity style={Style.card} onPress={() => {
            router.push({
                pathname: '/SalonDetail',
                params: {
                    name: prop.name,
                    services: prop.services,
                    distance: prop.distance,
                    rate: prop.rate,
                    price: prop.price,
                },
            });
        }}>
            <View>
                <Text style={Style.title}>{prop.name}</Text>
                <Text style={Style.description}>{prop.services}</Text>
                <Text>Distance: {prop.distance}KM</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text style={{ fontSize: 16, color: '#333' }}>Rating: {prop.rate}</Text>
                <Text style={{ fontSize: 16, color: '#333' }}>Price Range: {prop.price}</Text>
            </View>
        </TouchableOpacity>
    )
}
const Style = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
})
export default SalonCard