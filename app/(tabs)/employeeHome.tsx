import StatusBox from '@/components/StatusBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../socket/socketProvider';

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
    const [employeeID, setEmployeeID] = useState<string | null>(null);
    const [employeeName, setEmployeeName] = useState<string | null>(null);
    const [statusBox, setStatusBox] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const [customerConfirmation, setCustomerConfirmation] = useState<boolean>(false);
    const [processingResID, setProcessingResID] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const socket = useSocket();

    useEffect(() => {
        const fetchSalonID = async () => {
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            setSalonID(user?.salonID || null);
            setEmployeeID(user?.employeeID || null);
            setEmployeeName(user?.fullName || null);
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
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!salonID) return;
        // 1. Fetch initial pending reservations
        fetchReservations();
        // 2. Connect to WebSocket for real-time updates
        // const socket = io('http://192.168.1.2:3000', {
        //     transports: ['websocket'],
        //     query: { salonID },
        // });
    }, [salonID]);
    useEffect(() => {
        if (!socket) {
            console.warn('Employee: Socket not initialized');
            return;
        }
        socket.on('reservation:new', (reservation: Reservation) => {
            //alert('new reservation receving');
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
        // Listen for reservation status updates
        socket.on('reservation:statusUpdate', (updatedreservation: Reservation) => {
            //alert('status updating');
            setReservations(prev =>
                prev.map(r => (r.resID === updatedreservation.resID ? updatedreservation : r))
                    .filter(r => r.resStatus === 'pending') // Only show pending
            );
        }
        );
        const onConfirmed = async (data: { resID: string, customerID: string, employeeID: string, employeeName: string, salonID: string, resStatus: string, confirmed: boolean }) => {
            try {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;// Reset
                }
                const res = await fetch(`http://192.168.1.2:3000/reservations/${data.resID}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resStatus: data.resStatus, salonID: data.salonID, employeeID: data.employeeID, employeeName: data.employeeName, customerID: data.customerID }) // Include customerID in the request,
                });
                const result = await res.json();
                if (!result.success) {

                    setStatusBox({
                        message: 'Error with updating status',
                        type: 'error',
                    });
                } else {

                    setStatusBox({
                        message: 'Status update successfully',
                        type: 'success',
                    });
                }

            } catch (error) {

            } finally {
                setProcessingResID(null);
            }



        }
        const onRejected = async (data: { resID: string, employeeID: string, confirmed: boolean }) => {
            try {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;// Reset
                }

                console.log('Customer reject the reques' + data.confirmed);
                setStatusBox({
                    message: 'Customer reject the request',
                    type: 'error',
                });

            } catch (error) {

            } finally {
                setProcessingResID(null);
            }
        }

        socket.on('reservation:confirmed', onConfirmed);
        socket.on('reservation:rejected', onRejected);

        return () => {
            // Clean up the socket connection on unmount
            socket.off('reservation:new');
            socket.off('reservation:statusUpdate');
            socket.off('reservation:confirmed', onConfirmed);
            socket.off('reservation:rejected', onRejected);
        }

        // // Listen for new reservations and status updates
        // socket.on('reservation:new', (reservation: Reservation) => {
        //     console.log('New reservation:', reservation);
        // if (reservation.resStatus === 'pending' && reservation.salonID === salonID) {
        //     setReservations(prev => {
        //         const updated = [reservation, ...prev];
        //         updated.sort((a, b) => {
        //             // Combine date and time for each reservation
        //             const dateA = new Date(`${(formatDate(a.resDate))}T${a.resTime}`);
        //             const dateB = new Date(`${formatDate(b.resDate)}T${b.resTime}`);
        //             return dateA.getTime() - dateB.getTime(); // Ascending: earliest first
        //         });
        //         return updated;
        //     });
        // }
        // });
        // // Listen for reservation status updates

        // socket.on('reservation:statusUpdate', (updated: Reservation) => {
        // setReservations(prev =>
        //     prev.map(r => (r.resID === updated.resID ? updated : r))
        //         .filter(r => r.resStatus === 'pending') // Only show pending
        // );
        // });

        // // Clean up on unmount
        // return () => {
        //     socket.disconnect();
        // };
    }, [socket]);


    const handleProcessComplete = async (resID: string, newStatus: string, customerID: string) => {
        try {
            setProcessingResID(resID);
            console.log(`CustomerID: ${customerID}`);
            console.log(`employeeID: ${employeeID}`);
            console.log(`employeeName: ${employeeName}`);
            console.log(`resID: ${resID}`);
            console.log(`newStatus: ${newStatus}`);
            console.log(`salonID: ${salonID} \n \n`);
            // if (!customerConfirmation) {
            //     Alert.alert("Oops!", "Customer reject your request!.");
            //     return;
            // }

            timeoutRef.current = setTimeout(() => {
                setProcessingResID(null);
                setStatusBox({ message: 'Customer did not response to your request.', type: 'error' });
            }, 30000); // 30 seconds

            if (socket) {
                socket.emit('reservation:sendRequestToCustomer', {
                    resID: resID,
                    resStatus: newStatus,
                    customerID: customerID,
                    employeeID: employeeID,
                    employeeName: employeeName,
                    salonID: salonID
                });
            }

            // const response = await fetch('http://192.168.1.2:3000/socket/getCustomerConfirmation', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ resID: resID, customerID: customerID, employeeID: employeeID, employeeName: employeeName, salonID: salonID, resStatus: newStatus })
            // });

            // const result = await response.json();
            // if (result.success) {
            //     setStatusBox({
            //         message: "Request sent to customer",
            //         type: "info",
            //     });
            // } else {
            //     setStatusBox({
            //         message: "Request failed to send to customer",
            //         type: "error",
            //     });
            // }


            // const res = await fetch(`http://192.168.1.2:3000/reservations/${resID}/status`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ resStatus: newStatus, salonID: salonID, employeeID: employeeID, employeeName: employeeName, customerID: customerID }) // Include customerID in the request,
            // });
            // const data = await res.json();
            // if (!data.success) {
            //     Alert.alert('Error', data.message);
            //     return;
            // }

            // No need to update state here; socket will handle it
        } catch {
            Alert.alert('Error', 'Failed to update reservation status.');
        } finally {
            setCustomerConfirmation(false);
        }
    };

    // if (loading) {
    //     return (
    //         <View style={styles.center}>
    //             <ActivityIndicator size="large" color={THEME_COLOR} />
    //         </View>
    //     );
    // }

    return (
        <SafeAreaView style={styles.container}>
            {statusBox && (
                <StatusBox message={statusBox.message} type={statusBox.type} onHide={() => { setStatusBox(null) }} />
            )}
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
                            processingResID === item.resID ? (
                                <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }]}>
                                    <Text style={[styles.processBtnText, { color: THEME_COLOR, marginRight: 10 }]}>Wait for customer's response</Text>
                                    <ActivityIndicator size="small" color={THEME_COLOR} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.processBtn} onPress={() => handleProcessComplete(item.resID, 'processing', item.customerID)}>
                                    <Text style={styles.processBtnText}>Begin Process</Text>
                                </TouchableOpacity>
                            )
                        )}
                        {item.resStatus === 'processing' && (
                            <TouchableOpacity style={styles.processBtn} onPress={() => handleProcessComplete(item.resID, 'completed', item.customerID)}>
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