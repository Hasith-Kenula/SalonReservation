import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../../socket/socketProvider';

const THEME_COLOR = '#3586DB';
const STATUS_COLORS = {
    pending: '#FFC107',
    processing: '#2B6EC5',
    completed: '#27ae60',
    cancelled: '#e74c3c',

};
const TAB_BTN_COLOR = {
    activeBackground: THEME_COLOR,
    inactiveBackground: '#E1EAFF',
    activeText: '#FFFFFF',
    inactiveText: THEME_COLOR,
    sahdowColor: THEME_COLOR,

}

type Stats = {
    todaysReservations: number;
    totalRevenue: number;
    pending: number;
};

type Reservation = {
    resID: string;
    customerName: string;
    employeeName: string;
    customerPhone: string;
    resStatus: 'processing' | 'completed' | 'cancelled' | 'pending';
    resDate: string; // ISO date string
    resTime: string;
    reservedServices: string;
    totalPrice: string;
};


const SalonHome = () => {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
    const [processingReservations, setProcessingReservations] = useState<Reservation[]>([]);
    const [completedReservations, setCompletedReservations] = useState<Reservation[]>([]);
    const [tabBtnState, setTabBtnState] = useState<'pending' | 'processing' | 'completed'>('pending');

    const [salonID, setSalonID] = useState('');
    const socket = useSocket();

    const fetchTodayPendingReservations = async () => {
        const response = await fetch(`http://192.168.1.2:3000/reservations/todays_pending_reservations/${salonID}`)
        const result = await response.json();
        if (result.success) {
            setPendingReservations(result.data);
        }
    }
    const fetchTodayProcessingReservations = async () => {
        const response = await fetch(`http://192.168.1.2:3000/reservations/todays_processing_reservations/${salonID}`)
        const result = await response.json();
        if (result.success) {
            setProcessingReservations(result.data);
        }
    }
    const fetchTodayCompletedReservations = async () => {
        const response = await fetch(`http://192.168.1.2:3000/reservations/todays_completed_reservations/${salonID}`)
        const result = await response.json();
        if (result.success) {
            setCompletedReservations(result.data);
        }
    }
    const fetchTodaysStats = async () => {
        console.log(`Fetching stats for salon ${salonID}`);
        const response = await fetch(`http://192.168.1.2:3000/salons/today_stats/${salonID}`);
        const result = await response.json();
        console.log(result);
        if (result.success) {
            setStats({
                totalRevenue: result.data.revenue,
                pending: result.data.pending,
                todaysReservations: result.data.todaysReservation,
            });
        } else {
            console.log(result);
        }
    }
    useEffect(() => {
        if (!socket) return;
        socket.on('reservation:new', fetchTodaysStats);
        socket.on('reservation:statusUpdate', fetchTodaysStats);

        return () => {
            socket.off('reservation:new', fetchTodaysStats);
            socket.off('reservation:statusUpdate', fetchTodaysStats);
        }
    }, [socket]);
    useEffect(() => {
        const getSalonDetails = async () => {
            const response = await AsyncStorage.getItem('user');
            if (response) {
                const salon = JSON.parse(response);
                setSalonID(salon.salonID);
            } else {
                console.log('No salon details found');
            }
        }
        getSalonDetails();
        fetchTodaysStats();

        fetchTodayPendingReservations();
        fetchTodayProcessingReservations();
        fetchTodayCompletedReservations();

    }, [salonID])
    const handlePendingBtn = () => {
        setTabBtnState('pending');
        fetchTodayPendingReservations()
    }
    const handleProcessingBtn = () => {
        setTabBtnState('processing');
    }
    const handleCompletedBtn = () => {
        setTabBtnState('completed');
    }
    // You can fetch real stats and reservations here
    return (
        <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            <View style={styles.headings}>
                <Text style={styles.title}>Dashboard</Text>
            </View>
            {/* Stats */}
            <View style={{ paddingHorizontal: 10 }}>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Today's Reservations</Text>
                        <Text style={styles.statNumber}>{stats?.todaysReservations}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Today's Revenue</Text>
                        <Text style={styles.statNumber}>LKR {stats?.totalRevenue}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statNumber}>{stats?.pending}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    {/* <TouchableOpacity style={styles.actionButton} onPress={() => { }}>
                        <Text style={styles.actionText}>View Reservations</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.actionButton} onPress={() => { router.push('/serviceManagement') }}>
                        <Text style={styles.actionText}>Manage Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { router.push('/staffManagement') }}>
                        <Text style={styles.actionText}>Manage Staff</Text>
                    </TouchableOpacity>
                </View>

                {/* Upcoming Reservations */}
                <View style={[styles.btnContainer, { marginBottom: 8 }]}>
                    <TouchableOpacity style={[styles.tabBtn, tabBtnState === 'pending' ? styles.tabBtnActive : styles.tabBtnInActive]} onPress={handlePendingBtn}>
                        <Text style={[styles.tabBtnText, tabBtnState === 'pending' ? styles.tabBtnTextActive : styles.tabBtnTextInActive]}>Pending</Text>
                    </TouchableOpacity >
                    <TouchableOpacity style={[styles.tabBtn, tabBtnState === 'processing' ? styles.tabBtnActive : styles.tabBtnInActive]} onPress={handleProcessingBtn}>
                        <Text style={[styles.tabBtnText, tabBtnState === 'processing' ? styles.tabBtnTextActive : styles.tabBtnTextInActive]}>Processing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBtn, tabBtnState === 'completed' ? styles.tabBtnActive : styles.tabBtnInActive]} onPress={handleCompletedBtn}>
                        <Text style={[styles.tabBtnText, tabBtnState === 'completed' ? styles.tabBtnTextActive : styles.tabBtnTextInActive]}>Completed</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>{tabBtnState.charAt(0).toUpperCase() + tabBtnState.slice(1)} Reservations</Text>
            </View>
            <FlatList
                data={tabBtnState === 'pending' ? pendingReservations : tabBtnState === 'processing' ? processingReservations : completedReservations}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 60, paddingHorizontal: 10 }}
                keyExtractor={item => item.resID}
                renderItem={({ item }) => (
                    <View style={styles.reservationCard}>
                        <Text style={[styles.resID,]}>#{item.resID}</Text>
                        <Text style={styles.detail}>Phone: <Text style={styles.bold}>{item.customerPhone}</Text></Text>
                        <Text style={styles.detail}>Customer: <Text style={styles.bold}>{item.customerName}</Text></Text>
                        <Text style={styles.detail}>Date: <Text style={styles.bold}>{item.resDate}</Text></Text>
                        <Text style={styles.detail}>Time: <Text style={styles.bold}>{item.resTime}</Text></Text>
                        <Text style={styles.detail}>Services: <Text style={styles.bold}>{item.reservedServices}</Text></Text>
                        <Text style={[styles.detail,]}>Total: <Text style={[styles.price,]}>LKR {item.totalPrice}</Text></Text>
                    </View>
                )}
                style={{ marginBottom: 10 }}
                ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No {tabBtnState} reservations for today.</Text>}
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
    actionButton: {
        backgroundColor: '#3586DB',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: TAB_BTN_COLOR['sahdowColor'],
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,


    },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 8, color: '#222' },
    reservationCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        borderLeftWidth: 5,
        borderLeftColor: THEME_COLOR,
        elevation: 3,
    },
    resID: { fontWeight: 'bold', color: THEME_COLOR, fontSize: 16, marginBottom: 4 },
    detail: { fontSize: 15, color: '#222', marginBottom: 2 },
    bold: { fontWeight: 'bold', color: '#222' },
    price: { color: THEME_COLOR, fontWeight: 'bold' },
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
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    },

    tabBtn: {
        padding: 8,
        borderRadius: 8,
        shadowColor: TAB_BTN_COLOR['sahdowColor'],
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,

    },
    tabBtnActive: {
        backgroundColor: TAB_BTN_COLOR['activeBackground']
    },
    tabBtnInActive: {
        backgroundColor: TAB_BTN_COLOR['inactiveBackground'],
    },

    tabBtnText: {
        color: '#fff',
        fontWeight: '500',
    },
    tabBtnTextActive: {
        color: TAB_BTN_COLOR['activeText']
    },
    tabBtnTextInActive: {
        color: TAB_BTN_COLOR['inactiveText']
    },
});

export default SalonHome;