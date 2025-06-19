import { useTheme } from '@/context/ThemeContext';
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

const THEME_COLOR = '#3586DB';

const SalonCard = (prop: SalonCardProps) => {
    const { theme, toggleTheme, isDark } = useTheme(); // Assuming useTheme is defined in your context
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.tonal_a10,
                    borderLeftColor: theme.colors.primary_a30,
                    shadowColor: theme.colors.tonal_a30,
                }]}
            onPress={() => {
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
            }}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.salonName, { color: theme.colors.primary_a30 }]}>{prop.name}</Text>
                <View style={[styles.ratingBadge, { backgroundColor: theme.colors.tonal_a20 }]}>
                    <Text style={[styles.ratingText, { color: theme.colors.primary_a40 }]}>
                        {prop.rate !== null ? `★ ${prop.rate}` : 'No Rating'}
                    </Text>
                </View>
            </View>
            <Text style={[styles.address, { color: theme.colors.textColor }]}>{prop.address}</Text>
            <Text style={[styles.detail, { color: theme.colors.primary_a50 }]}>
                Services: <Text style={[styles.bold, { color: theme.colors.textColor }]}>{prop.services.map((service) => service.service).join(', ')}</Text>
            </Text>
            <Text style={[styles.detail, { color: theme.colors.primary_a50 }]}>
                Distance: <Text style={[styles.bold, { color: theme.colors.textColor }]}>{prop.distance} KM</Text>
            </Text>
            <View style={styles.infoRow}>
                <Text style={[styles.priceRange, { color: theme.colors.primary_a40 }]}>Price Range: {prop.priceRange}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 18,
        borderRadius: 12,
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 16,
        borderLeftWidth: 5,
        borderLeftColor: THEME_COLOR,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    salonName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME_COLOR,
        flex: 1,
        marginRight: 10,
    },
    ratingBadge: {
        backgroundColor: '#f1c40f',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
    },
    ratingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    address: {
        fontSize: 14,
        color: '#888',
        marginBottom: 6,
    },
    detail: {
        fontSize: 15,
        color: '#222',
        marginBottom: 2,
    },
    bold: {
        fontWeight: 'bold',
        color: '#222',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    priceRange: {
        fontSize: 15,
        color: THEME_COLOR,
        fontWeight: 'bold',
    },
});

export default SalonCard;