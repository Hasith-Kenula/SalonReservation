import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockStats = {
    todayAppointments: 4,
    totalRevenue: 15000,
    pending: 2,
};

const mockReservations = [
    { id: '1', time: '09:00 AM', customer: 'Jane Doe', service: 'Haircut' },
    { id: '2', time: '10:30 AM', customer: 'John Smith', service: 'Coloring' },
];



const SalonHome = () => {
    const router = useRouter();
    const [stats, setStats] = useState(mockStats);
    const [reservations, setReservations] = useState(mockReservations);


    // You can fetch real stats and reservations here

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            <View style={styles.headings}>
                <Text style={styles.title}>Dashboard</Text>
            </View>
            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.todayAppointments}</Text>
                    <Text style={styles.statLabel}>Today's Appointments</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>LKR {stats.totalRevenue}</Text>
                    <Text style={styles.statLabel}>Today's Revenue</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.pending}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => { }}>
                    <Text style={styles.actionText}>View Reservations</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { router.push('/serviceManagement') }}>
                    <Text style={styles.actionText}>Manage Services</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { router.push('/staffManagement') }}>
                    <Text style={styles.actionText}>Manage Staff</Text>
                </TouchableOpacity>
            </View>

            {/* Upcoming Reservations */}
            <Text style={styles.sectionTitle}>Upcoming Reservations</Text>
            <FlatList
                data={reservations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reservationCard}>
                        <Text style={styles.resTime}>{item.time}</Text>
                        <Text style={styles.resCustomer}>{item.customer}</Text>
                        <Text style={styles.resService}>{item.service}</Text>
                    </View>
                )}
                style={{ marginBottom: 10 }}
                ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No reservations for today.</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    heading: {
        alignContent: 'center',
        borderBottomColor: "rgba(131, 131, 131, 0.51)",
        borderBottomWidth: 1
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#3586DB',
        marginBottom: 10,
        marginLeft: 10,
        alignSelf: 'flex-start'
    },
    salonName: { fontSize: 16, color: '#555', marginBottom: 18 },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    statBox: { backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center', flex: 1, marginHorizontal: 4, elevation: 2 },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#3586DB' },
    statLabel: { fontSize: 13, color: '#888', marginTop: 2 },
    quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
    actionButton: { backgroundColor: '#3586DB', borderRadius: 8, padding: 12, flex: 1, marginHorizontal: 4, alignItems: 'center' },
    actionText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 8, color: '#222' },
    reservationCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, elevation: 1 },
    resTime: { fontWeight: 'bold', color: '#3586DB' },
    resCustomer: { fontSize: 16, color: '#222' },
    resService: { fontSize: 14, color: '#888' },
    title: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
    },
    headings: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(131, 131, 131, 0.51)',
        borderBottomWidth: 1,
    },
});

export default SalonHome;