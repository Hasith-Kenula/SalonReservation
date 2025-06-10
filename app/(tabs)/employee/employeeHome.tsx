import StatusBox from '@/components/StatusBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../../socket/socketProvider';

const THEME_COLOR = '#3586DB';


type Reservation = {
    resID: string;
    salonID: string;
    customerID: string;
    resDate: string; // ISO date string
    resTime: string;
    resStatus: 'processing' | 'completed' | 'cancelled' | 'pending';
    customerName: string;
    customerPhone: string;
    reservedServices: string;
    totalPrice: string;
};
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
const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 10);
};
const EmployeeHome = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [processingReservations, setProcessingReservations] = useState<Reservation[]>([]);
    const [completedReservations, setCompletedReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [salonID, setSalonID] = useState<string | null>(null);
    const [employeeID, setEmployeeID] = useState<string | null>(null);
    const [employeeName, setEmployeeName] = useState<string | null>(null);
    const [statusBox, setStatusBox] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [customerConfirmation, setCustomerConfirmation] = useState<boolean>(false);
    const [processingResID, setProcessingResID] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const [tabBtnState, setTabBtnState] = useState<'pending' | 'processing' | 'completed'>('pending');
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
    const fetchProcecssingReservations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.2:3000/reservations/employee/processing/${employeeID}`);
            const result = await response.json();
            if (result.success) {
                setProcessingReservations(result.data);
            } else {
                setStatusBox({ message: result.message, type: 'warning' });
                setProcessingReservations([]);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
    const fetchCompletedReservations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.2:3000/reservations/employee/completed/${employeeID}`);
            const result = await response.json();
            if (result.success) {
                setCompletedReservations(result.data);
            } else {
                setStatusBox({ message: result.message, type: 'warning' });
                setCompletedReservations([]);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
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
                prev.filter(r => r.resID !== updatedreservation.resID && r.resStatus === 'pending')
            );
            setProcessingReservations(prev =>
                prev.filter(r => r.resID !== updatedreservation.resID && r.resStatus === 'processing')
            );
            setCompletedReservations(prev =>
                prev.filter(r => r.resID !== updatedreservation.resID && r.resStatus === 'completed')
            );

            // Find existing reservation in any list to preserve missing fields
            const findExistingReservation = () => {
                const allReservations = [...reservations, ...processingReservations, ...completedReservations];
                return allReservations.find(r => r.resID === updatedreservation.resID);
            };

            const existingReservation = findExistingReservation();

            // Merge updated reservation with existing to preserve missing fields
            const mergedReservation = { ...existingReservation, ...updatedreservation };

            // Add merged reservation to the correct list based on its status
            if (mergedReservation.resStatus === 'pending') {
                setReservations(prev => [...prev, mergedReservation]);
            } else if (mergedReservation.resStatus === 'processing') {
                setProcessingReservations(prev => [...prev, mergedReservation]);
            } else if (mergedReservation.resStatus === 'completed') {
                setCompletedReservations(prev => [...prev, mergedReservation]);
            }
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
                console.log("Request sending to customer....");
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
    const handlePendingBtn = () => {
        setTabBtnState('pending')
    }
    const handleProcessingBtn = () => {
        setTabBtnState('processing')
    }
    const handleCompletedBtn = () => {
        setTabBtnState('completed')
    }

    const filterReservations = useMemo(() => {
        switch (tabBtnState) {
            case 'pending':
                return reservations;
            case 'processing':
                return processingReservations;
            case 'completed':
                return completedReservations;
            default:
                return [];
        }
    }, [tabBtnState, reservations, processingReservations, completedReservations]);
    return (
        <SafeAreaView style={styles.container}>
            {statusBox && (
                <StatusBox message={statusBox.message} type={statusBox.type} onHide={() => { setStatusBox(null) }} />
            )}
            <View style={styles.headings}>
                <Text style={styles.title}>{tabBtnState.charAt(0).toUpperCase() + tabBtnState.slice(1)} Reservations</Text>

            </View>
            <View style={styles.btnContainer}>
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
            <FlatList
                data={filterReservations}
                style={{ paddingHorizontal: 15 }}
                keyExtractor={item => item.resID}
                renderItem={({ item }) => (
                    <View style={[styles.card,]}>
                        <Text style={[styles.resID,]}>#{item.resID}</Text>
                        <Text style={styles.detail}>Phone: <Text style={styles.bold}>{item.customerPhone}</Text></Text>
                        <Text style={styles.detail}>Customer: <Text style={styles.bold}>{item.customerName}</Text></Text>
                        <Text style={styles.detail}>Date: <Text style={styles.bold}>{item.resDate}</Text></Text>
                        <Text style={styles.detail}>Time: <Text style={styles.bold}>{item.resTime}</Text></Text>
                        <Text style={styles.detail}>Services: <Text style={styles.bold}>{item.reservedServices}</Text></Text>
                        <Text style={[styles.detail,]}>Total: <Text style={[styles.price,]}>LKR {item.totalPrice}</Text></Text>
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
                            processingResID === item.resID ? (
                                <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }]}>
                                    <Text style={[styles.processBtnText, { color: THEME_COLOR, marginRight: 10 }]}>Wait for customer's response</Text>
                                    <ActivityIndicator size="small" color={THEME_COLOR} />
                                </TouchableOpacity>
                            ) : (
                                < TouchableOpacity style={styles.processBtn} onPress={() => handleProcessComplete(item.resID, 'completed', item.customerID)}>
                                    <Text style={styles.processBtnText}>Mark as Complete</Text>
                                </TouchableOpacity>
                            )

                        )}
                        {item.resStatus === 'completed' && (
                            <View style={[styles.statusBadge, { backgroundColor: THEME_COLOR }]}>
                                <Text style={styles.statusBadgeText}>{item.resStatus.toUpperCase()}</Text>
                            </View>
                        )}
                    </View>
                )
                }
                ListEmptyComponent={< Text style={{ color: '#888', textAlign: 'center' }}> No {tabBtnState} reservations.</Text >}
                refreshing={loading}
                onRefresh={tabBtnState === 'pending' ? fetchReservations : tabBtnState === 'processing' ? fetchProcecssingReservations : fetchCompletedReservations} // Trigger re-fetch
            />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingBottom: 60, },
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
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
    processBtn: {
        backgroundColor: THEME_COLOR,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 18,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 5
    },
    statusBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    processBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EmployeeHome;