import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Service = {
    service: string;
    serviceID: string;
    price: string;
};

type SalonCardProps = {
    salonID: string;
    name: string;
    ownerName: string;
    address: string;
    services: Service[];
    distance: number;
    rate: number | null;
    priceRange: string;
};

const SalonCard = (prop: SalonCardProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity style={Style.card} onPress={() => {
            router.push({
                pathname: '/salonDetail',
                params: {
                    name: prop.name,
                    salonID: prop.salonID,
                    ownerName: prop.ownerName,
                    services: JSON.stringify(prop.services),
                    distance: prop.distance,
                    rate: prop.rate,
                    priceRange: prop.priceRange,
                },
            });
        }}>
            <View>
                <Text style={Style.title}>{prop.name}</Text>
                <Text style={Style.address}>{prop.address}</Text>
                <Text style={Style.description}>
                    {prop.services.map((service) => service.service).join(', ')}
                </Text>
                <Text style={Style.detail}>Distance: {prop.distance} KM</Text>
            </View>
            <View style={Style.infoRow}>
                <Text style={Style.infoText}>
                    Rating: {prop.rate !== null ? prop.rate : 'N/A'}
                </Text>
                <Text style={Style.infoText}>
                    Price Range: {prop.priceRange}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const Style = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3586DB',
        marginBottom: 0,
    },
    address: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
    detail: {
        fontSize: 15,
        color: '#555',
        marginTop: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
});

export default SalonCard;