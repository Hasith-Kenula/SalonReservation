import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SalonDetail = () => {
    const { name, services, distance, rate, price, ownerName, priceRange, salonID } = useLocalSearchParams();
    const availableServices = typeof services === 'string'
        ? JSON.parse(services)
        : Array.isArray(services)
            ? services
            : [];

    const [selectedServices, setSelectedServices] = useState<{ service: string; price: string; serviceID: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

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

    const handleReserve = async () => {
        console.log('Selected Services:', selectedServices);
        console.log('Selected Service Length:', selectedServices.length);
        if (!selectedServices.length) {
            alert('Please select at least one service.');
            return;
        }
        if (!selectedDate) {
            alert('please select a Date');
            return
        }
        if (!selectedTime) {
            alert('please select a Time');
            return
        }
        // Add your reservation logic here
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

    return (
        <SafeAreaView style={Style.mainContainer}>
            <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
            <View style={Style.headings}>
                <Text style={Style.title}>Salon Details</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <View style={Style.salonTitle}>
                    <Text style={Style.subTitle}>{name}</Text>
                    <Text style={Style.info}>Owner Name: {ownerName}</Text>
                    <Text style={Style.info}>Services: {availableServices.map((service: any) => `${service.service}`).join(', ')}</Text>
                    <Text style={Style.info}>Distance: {distance} KM</Text>
                    <Text style={Style.info}>Rating: {rate}</Text>
                    <Text style={Style.info}>Price Range: {priceRange}</Text>
                </View>

                <View style={Style.section}>
                    <Text style={Style.sectionTitle}>Select Services</Text>
                    {availableServices.map((service: any) => {
                        const isSelected = selectedServices.some(
                            (s) => s.serviceID === service.serviceID
                        );
                        return (
                            <TouchableOpacity
                                key={service.service}
                                style={[
                                    Style.serviceItem,
                                    isSelected && Style.serviceItemSelected,
                                ]}
                                onPress={() => toggleService(service)}
                            >
                                <Text style={{
                                    color: isSelected ? '#fff' : '#222',
                                }}>
                                    {service.service}
                                </Text>
                                <Text style={{
                                    color: isSelected ? '#fff' : '#222',
                                }}>
                                    LKR {service.price}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity
                    style={Style.input}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{selectedDate || 'Pick a date'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate ? new Date(selectedDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setSelectedDate(date.toISOString().split('T')[0]);
                        }}
                    />
                )}

                <TouchableOpacity
                    style={Style.input}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text>{selectedTime || 'Pick a time'}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={selectedTime ? new Date(`1970-01-01T${selectedTime}:00`) : new Date()}
                        mode="time"
                        display="default"
                        onChange={(event, date) => {
                            setShowTimePicker(false);
                            if (date) setSelectedTime(date.toTimeString().slice(0, 5));
                        }}
                    />
                )}

                <TouchableOpacity style={Style.reserveButton} onPress={handleReserve}>
                    <Text style={Style.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const Style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
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