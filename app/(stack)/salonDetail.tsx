import { useTheme } from '@/context/ThemeContext';
import { useSocket } from '@/socket/socketProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type TodaysReservedTimes = {
    resID: string,
    startTime: string,
    endTime: string,
}

type SalonOpeningHours = {
    id: string;
    salonID: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
}

const SalonDetail = () => {
    const { name, services, distance, rate, price, ownerName, priceRange, salonID } = useLocalSearchParams();
    const availableServices = typeof services === 'string'
        ? JSON.parse(services)
        : Array.isArray(services)
            ? services
            : [];

    const socket = useSocket();
    const [customerID, setCustomerID] = useState('');
    const [selectedServices, setSelectedServices] = useState<{ service: string; price: string; serviceID: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [todaysReservedTimes, setTodaysReservedTimes] = useState<TodaysReservedTimes[]>([]);
    const [salonOpeningHours, setSalonOpeningHours] = useState<SalonOpeningHours[] | null>(null);
    const [salonOpeningHoursLoading, setSalonOpeningHoursLoading] = useState(false);
    const { theme, isDark } = useTheme();
    const router = useRouter();

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const getCustomerID = async () => {
        const customerJSON = await AsyncStorage.getItem('user');
        if (customerJSON) setCustomerID(JSON.parse(customerJSON).customerID)
    }
    const handleTodaysReservation = async ({ resID, startTime, endTime }: TodaysReservedTimes) => {
        console.log(`Recive: ${resID}, ${startTime}, ${endTime}`);
        setTodaysReservedTimes((prev) => {
            const updated = [...prev.filter(r => r.resID !== resID), { resID, startTime, endTime }];
            updated.sort((a, b) => a.startTime.localeCompare(b.startTime));
            return updated;
        });
    }
    const handleOpeningHourUpdate = (data: SalonOpeningHours) => {
        console.log(data);
        setSalonOpeningHours((prev) => {
            const updated = prev!.map(r => r.id === data.id ? data : r);
            return updated;
        });
    }
    const fetchSalonOpeningHours = async () => {
        try {
            setSalonOpeningHoursLoading(true);
            const response = await fetch(`http://192.168.1.2:3000/salon_opening_hours/${salonID}`);
            const result = await response.json();
            if (result.success) {
                setSalonOpeningHours(result.data);
            } else {
                setSalonOpeningHours(null);
            }

        } catch (error) {
            console.error('Error fetching salon opening hours:', error);
        } finally {
            setSalonOpeningHoursLoading(false);
        }
    }
    useEffect(() => {
        getCustomerID();
        if (!socket || !customerID || !salonID) return;
        const roomName = `salonCustomer_${salonID}`
        socket.emit('joinRoom', roomName);

        socket.on('reservation:todays', handleTodaysReservation);
        socket.on('salonOpeningHours:update', handleOpeningHourUpdate);

        return () => {
            socket.emit('leaveRoom', roomName);
            socket.off('salonOpeningHours:update', handleOpeningHourUpdate);
            socket.off('reservation:todays', handleTodaysReservation);
        }
    }, [socket, salonID, customerID]);

    const toggleService = (service: { service: string, price: string, serviceID: string }) => {
        const exists = selectedServices.some(
            (s) => s.serviceID === service.serviceID
        );
        if (exists) {
            setSelectedServices(selectedServices.filter(
                (s) => !(s.serviceID === service.serviceID)
            ));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    useEffect(() => {
        //Fetch Today's Reservation for the salon
        const fetchTodaysReservedTimes = async () => {
            const todaysReseredTimes = await fetch(`http://192.168.1.2:3000/reservations/today/${salonID}`);
            const response = await todaysReseredTimes.json();
            if (response.success) {
                setTodaysReservedTimes(response.data);
            } else {

            }
        }

        fetchTodaysReservedTimes();
        fetchSalonOpeningHours();
    }, [salonID])
    const handleReserve = async () => {
        console.log('Selected Services:', selectedServices);
        console.log('Selected Service Length:', selectedServices.length);
        if (!selectedServices.length) {
            Alert.alert('No Services Selected', 'Please select at least one service to reserve.', [
                { text: 'OK' }
            ], { userInterfaceStyle: isDark ? 'dark' : 'light' });
            return;
        }
        if (!selectedDate) {
            Alert.alert('Alert', 'Please select a date', [{ text: 'OK' }], { userInterfaceStyle: isDark ? 'dark' : 'light' });
            return
        }
        if (!selectedTime) {
            Alert.alert('Alert', 'Please select a time', [{ text: 'OK' }], { userInterfaceStyle: isDark ? 'dark' : 'light' });
            return
        }
        // reservation/reserve logic here
        Alert.alert('Confirm Your Reservation', `Reserved ${selectedServices.map((item) => item.service).join(', ')} at ${name}\nDate: ${selectedDate || 'Not set'}\nTime: ${selectedTime || 'Not set'}`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Confirm', style: 'default', onPress: async () => {
                    const userJson = await AsyncStorage.getItem('user');
                    const user = userJson ? JSON.parse(userJson) : null;
                    const customerID = user.customerID;
                    if (!customerID) {
                        Alert.alert('Error', 'You must be logged in to make a reservation');
                        return;
                    }
                    const arrayOfReservationServices: { serviceID: string }[] = selectedServices.map((service) => ({
                        serviceID: service.serviceID,
                    }));
                    const response = await fetch('http://192.168.1.2:3000/reservations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            salonID: salonID,
                            customerID: customerID,
                            resDate: selectedDate,
                            resTime: selectedTime,
                            resServices: arrayOfReservationServices,
                        })
                    });
                    const reservationData = await response.json();
                    if (!reservationData.success) {
                        Alert.alert('Error', reservationData.message);
                        return
                    }
                    const _resID = reservationData.data.resID;


                    Alert.alert('Success', 'Reservation made successfully');
                    setSelectedServices([]);
                    setSelectedDate('');
                    setSelectedTime('');

                }
            },
        ]);
    };
    const isSameDay = (date1: Date, date2: Date) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }
    const getMinimumTime = () => {
        if (selectedDate && isSameDay(new Date(selectedDate), new Date())) {
            return new Date();
        }
        return new Date('1970-01-01T00:00:00:');
    }
    const today = () => {
        const date = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const day = days[date.getDay()];
        return day;
    }
    const parseTimeStringToDate = (timeString: string) => {
        if (!timeString) return new Date();
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
        return date;
    };
    const convert24hTo12h = (time24: string) => {
        const [hourStr, minuteStr] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr;
        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12; // Converts 0 -> 12 and 13..23 -> 1..11

        return `${hour}:${minute} ${ampm}`;
    }
    const openingHoursActivitityIndicator = () => {
        return (
            <ActivityIndicator size='small' color='#3586DB' style={{ marginTop: 10 }} />
        );
    }


    //Payments
    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`http://192.168.1.2:3000/stripe-payment/payment-sheet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        try {
            const {
                paymentIntent,
                ephemeralKey,
                customer,
            } = await fetchPaymentSheetParams();

            const { error } = await initPaymentSheet({
                merchantDisplayName: "Example, Inc.",
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
                //methods that complete payment after a delay, like SEPA Debit and Sofort.
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: 'Jane Doe',
                },
                returnURL: 'saloonreservation://salon-detail',
            });
            if (!error) {
                setLoading(true);
            }

        } catch (error: any) {
            console.error(`Error: ${error.message}`);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };



    return (
        <SafeAreaView style={[Style.mainContainer, { backgroundColor: theme.colors.tonal_a0 }]} edges={['left', 'top', 'right']}>
            <View style={Style.headings}>
                <Text style={[Style.title, { color: theme.colors.textColor }]}>Salon Details</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <View style={[Style.salonTitle, { backgroundColor: theme.colors.tonal_a10 }]}>
                    <Text style={[Style.subTitle, { color: theme.colors.primary_a0 }]}>{name}</Text>
                    <Text style={[Style.info, { color: theme.colors.label }]}>Owner Name: {ownerName}</Text>
                    <Text style={[Style.info, { color: theme.colors.label }]}>Services: {availableServices.map((service: any) => `${service.service}`).join(', ')}</Text>
                    <Text style={[Style.info, { color: theme.colors.label }]}>Distance: {distance} KM</Text>
                    <Text style={[Style.info, { color: theme.colors.label }]}>Rating: {rate}</Text>
                    <Text style={[Style.info, { color: theme.colors.label }]}>Price Range: {priceRange}</Text>
                </View>
                <View style={Style.section}>
                    <Text style={[Style.sectionTitle, { color: theme.colors.textColor }]}>Opening Times</Text>
                    {salonOpeningHoursLoading && (
                        openingHoursActivitityIndicator()
                    )}
                    {salonOpeningHours ? salonOpeningHours?.map((openingHours: SalonOpeningHours) => {
                        return (
                            <View key={openingHours.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                <Text style={{ fontWeight: today() == openingHours.day_of_week ? 'bold' : 'normal', color: theme.colors.textColor }}>{openingHours.day_of_week}</Text>
                                <Text style={{ fontWeight: today() == openingHours.day_of_week ? 'bold' : 'normal', color: theme.colors.textColor }}>
                                    {!openingHours.is_closed ? (`${convert24hTo12h(openingHours.open_time)} - ${convert24hTo12h(openingHours.close_time)}`) : ('Closed')}
                                </Text>
                            </View>
                        )
                    }) : !salonOpeningHoursLoading && !salonOpeningHours && (<Text style={{ color: theme.colors.textColor }}>Unable to find opening hours for this salon!</Text>)}
                </View>
                <View style={Style.section}>
                    <Text style={[Style.sectionTitle, { color: theme.colors.textColor }]}>Select Services</Text>
                    {availableServices.map((service: any) => {
                        const isSelected = selectedServices.some(
                            (s) => s.serviceID === service.serviceID
                        );
                        return (
                            <TouchableOpacity
                                key={service.service}
                                style={[
                                    Style.serviceItem,
                                    { backgroundColor: isSelected ? theme.colors.primary_a0 : theme.colors.tonal_a10 }
                                ]}
                                onPress={() => toggleService(service)}
                            >
                                <Text style={{
                                    color: isSelected ? isDark ? '#fff' : '#fff' : theme.colors.textColor,

                                }}>
                                    {service.service}
                                </Text>
                                <Text style={{
                                    color: isSelected ? isDark ? '#fff' : '#fff' : theme.colors.textColor,
                                }}>
                                    LKR {service.price}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={Style.section}>
                    <Text style={[Style.sectionTitle, { color: theme.colors.textColor }]}>Today's Reserved Times</Text>
                    <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
                        {todaysReservedTimes.length > 0 ? todaysReservedTimes.map((times, index) => {

                            return (
                                <TouchableOpacity
                                    key={times.resID}
                                    style={[Style.timeItem, { backgroundColor: theme.colors.tonal_a10 }]}
                                >
                                    <Text style={{ color: theme.colors.textColor }}>Start Time : {times.startTime}</Text>
                                    <Text style={{ color: theme.colors.textColor }}>End Time : {times.endTime}</Text>

                                </TouchableOpacity>
                            )
                        }) : (
                            <Text style={{ color: theme.colors.textColor }}>No reserved times found for today</Text>
                        )}

                    </ScrollView>
                </View>
                <TouchableOpacity
                    style={[Style.input, { backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a30 }]}
                    onPress={() => setShowDatePicker(!showDatePicker)}
                >
                    <Text style={{ color: theme.colors.textColor }}>{selectedDate || 'Pick a date'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate ? new Date(selectedDate) : new Date()}
                        mode="date"
                        display="default"
                        // textColor='#3586DB'
                        themeVariant={isDark ? 'dark' : 'light'}
                        minimumDate={new Date()}
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            setSelectedTime('');
                            if (date) {
                                const year = date.getFullYear();
                                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                const day = date.getDate().toString().padStart(2, '0');
                                setSelectedDate(`${year}-${month}-${day}`);
                            }
                        }}
                    />
                )}

                <TouchableOpacity
                    style={[Style.input, { backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a30 }]}
                    onPress={() => setShowTimePicker(!showTimePicker)}
                >
                    <Text style={{ color: theme.colors.textColor }}>{selectedTime || 'Pick a time'}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={parseTimeStringToDate(selectedTime)}
                        mode="time"
                        display="default"
                        themeVariant={isDark ? 'dark' : 'light'}
                        minimumDate={
                            getMinimumTime()
                        }
                        onChange={(event, time) => {
                            setShowTimePicker(false);
                            console.log(time!.toTimeString().slice(0, 5));

                            if (time) setSelectedTime(time.toTimeString().slice(0, 5));
                        }}
                    />
                )}

                <TouchableOpacity style={Style.reserveButton} onPress={handleReserve}>
                    <Text style={Style.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Style.reserveButton} onPress={async () => {
                    await initializePaymentSheet().then(
                        async () => {
                            await openPaymentSheet();
                        }
                    )
                }} >
                    <Text style={Style.reserveButtonText}>Pay Here</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const Style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
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
    salonTitle: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f5f7fa',
        borderRadius: 10,
    },
    subTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3586DB',
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        color: '#555',
        marginBottom: 3,
    },
    section: {
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#222',
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginBottom: 8,
    },
    timeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginBottom: 8,
    },
    serviceItemSelected: {
        backgroundColor: '#3586DB',
    },
    input: {
        padding: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    reserveButton: {
        backgroundColor: '#3586DB',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    reserveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
export default SalonDetail