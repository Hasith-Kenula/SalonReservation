import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Service = {
    service: string;
    price: string;
};

type SalonCardProps = {
    name: string;
    services: Service[];
    distance: number;
    rate: number;
};

const SalonCard = (prop: SalonCardProps) => {
    // const navigation: any = useNavigation();
    const router = useRouter();
    return (
        <TouchableOpacity style={Style.card} onPress={() => {
            router.push({
                pathname: '/salonDetail',
                params: {
                    name: prop.name,
                    services: JSON.stringify(prop.services),
                    distance: prop.distance,
                    rate: prop.rate,
                },
            });
        }}>
            <View>
                <Text style={Style.title}>{prop.name}</Text>
                <Text style={Style.description}>{prop.services.map((service) => service.service).join(', ')}</Text>
                <Text>Distance: {prop.distance}KM</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text style={{ fontSize: 16, color: '#333' }}>Rating: {prop.rate}</Text>
                <Text style={{ fontSize: 16, color: '#333' }}>Price Range: {
                    `${Math.min(...prop.services.map(s => Number(s.price)))} - ${Math.max(...prop.services.map(s => Number(s.price)))}`
                }</Text>
            </View>
        </TouchableOpacity >
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
        elevation: 5,
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