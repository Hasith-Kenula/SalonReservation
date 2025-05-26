import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';

const THEME_COLOR = '#3586DB';

type Reservation = {
    resID: string;
    salonID: string;
    customerID: string;
    resDate: string; // ISO date string
    resTime: string;
    resStatus: string;
    customerName: string;
    customerPhone: string;
    reservedServices: string;
    totalPrice: string;
};
const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 10);
};
const EmployeeHome = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [salonID, setSalonID] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalonID = async () => {
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            setSalonID(user?.salonID || null);
        };
        fetchSalonID();
    }, []);
    const fetchReservations = async () => {
        setLoading(true);
        try {

            const response = await fetch(`http://192.168.1.2:3000/reservations/salon/${salonID}?status=pending`);
            const result = await response.json();
            if (result.success) {
                setReservations(result.data);
            } else {
                Alert.alert('Error', result.message);
                setReservations([]);
            }
        } catch {
            setReservations([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!salonID) return;

        // 1. Fetch initial pending reservations


        fetchReservations();

        // 2. Connect to WebSocket for real-time updates
        const socket = io('http://192.168.1.2:3000', {
            transports: ['websocket'],
            query: { salonID },
        });

        // Listen for new reservations and status updates
        socket.on('reservation:new', (reservation: Reservation) => {
            console.log('New reservation:', reservation);
            if (reservation.resStatus === 'pending' && reservation.salonID === salonID) {
                setReservations(prev => {
                    const updated = [reservation, ...prev];
                    updated.sort((a, b) => {
                        // Combine date and time for each reservation
                        const dateA = new Date(`${(formatDate(a.resDate))}T${a.resTime}`);
                        const dateB = new Date(`${formatDate(b.resDate)}T${b.resTime}`);
                        return dateA.getTime() - dateB.getTime(); // Ascending: earliest first
                    });
                    return updated;
                });
            }
        });

        socket.on('reservation:statusUpdate', (updated: Reservation) => {
            setReservations(prev =>
                prev.map(r => (r.resID === updated.resID ? updated : r))
                    .filter(r => r.resStatus === 'pending') // Only show pending
            );
        });

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, [salonID]);

    const handleProcessComplete = async (resID: string, customerID: string, newStatus: string) => {
        try {
            const res = await fetch(`http://192.168.1.2:3000/reservations/${resID}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resStatus: newStatus, salonID: salonID }) // Include customerID in the request,
            });
            const data = await res.json();
            if (!data.success) {
                Alert.alert('Error', data.message);
                return;
            }

            // No need to update state here; socket will handle it
        } catch {
            Alert.alert('Error', 'Failed to update reservation status.');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={THEME_COLOR} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Pending Reservations</Text>
            <FlatList
                data={reservations}
                keyExtractor={item => item.resID}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.resID}>#{item.resID}</Text>
                        <Text style={styles.detail}>Phone: <Text style={styles.bold}>{item.customerPhone}</Text></Text>
                        <Text style={styles.detail}>Customer: <Text style={styles.bold}>{item.customerName}</Text></Text>
                        <Text style={styles.detail}>Date: <Text style={styles.bold}>{formatDate(item.resDate)}</Text></Text>
                        <Text style={styles.detail}>Time: <Text style={styles.bold}>{item.resTime}</Text></Text>
                        <Text style={styles.detail}>Services: <Text style={styles.bold}>{item.reservedServices}</Text></Text>
                        <Text style={styles.detail}>Total: <Text style={styles.price}>LKR {item.totalPrice}</Text></Text>
                        {item.resStatus === 'pending' && (
                            <TouchableOpacity style={styles.processBtn} onPress={() => handleProcessComplete(item.resID, item.customerID, 'processing')}>
                                <Text style={styles.processBtnText}>Begin Process</Text>
                            </TouchableOpacity>
                        )}
                        {item.resStatus === 'processing' && (
                            <TouchableOpacity style={styles.processBtn} onPress={() => handleProcessComplete(item.resID, item.customerID, 'completed')}>
                                <Text style={styles.processBtnText}>Mark as Complete</Text>
                            </TouchableOpacity>
                        )}
                        {item.resStatus === 'completed' && (
                            <Text style={styles.detail}>Completed</Text>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No pending reservations.</Text>}
                refreshing={loading}
                onRefresh={fetchReservations} // Trigger re-fetch
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 10 },
    title: { fontSize: 26, fontWeight: 'bold', color: THEME_COLOR, margin: 16 },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        borderLeftWidth: 5,
        borderLeftColor: THEME_COLOR,
        elevation: 3,
    },
    resID: { fontWeight: 'bold', color: THEME_COLOR, fontSize: 16, marginBottom: 4 },
    detail: { fontSize: 15, color: '#222', marginBottom: 2 },
    bold: { fontWeight: 'bold', color: '#222' },
    price: { color: THEME_COLOR, fontWeight: 'bold' },
    processBtn: {
        backgroundColor: THEME_COLOR,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 18,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    processBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EmployeeHome;