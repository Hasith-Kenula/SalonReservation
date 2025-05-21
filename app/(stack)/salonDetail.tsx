import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SalonDetail = () => {
    const { name, services, distance, rate, price } = useLocalSearchParams();
    const availableServices = typeof services === 'string'
        ? JSON.parse(services)
        : Array.isArray(services)
            ? services
            : [];

    const [selectedServices, setSelectedServices] = useState<{ service: string; price: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const toggleService = (service: { service: string, price: string }) => {
        const exists = selectedServices.some(
            (s) => s.service === service.service && s.price === service.price
        );
        if (exists) {
            setSelectedServices(selectedServices.filter(
                (s) => !(s.service === service.service && s.price === service.price)
            ));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleReserve = () => {
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
        alert(
            `Reserved ${selectedServices.map((item) => item.service).join(', ')} at ${name}\nDate: ${selectedDate || 'Not set'}\nTime: ${selectedTime || 'Not set'}`
        );
    };

    return (
        <SafeAreaView style={Style.mainContainer}>
            <View style={Style.headings}>
                <Text style={Style.title}>Salon Details</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <View style={Style.salonTitle}>
                    <Text style={Style.subTitle}>{name}</Text>
                    <Text style={Style.info}>Services: {availableServices.map((service: any) => `${service.service}`).join(', ')}</Text>
                    <Text style={Style.info}>Distance: {distance} KM</Text>
                    <Text style={Style.info}>Rating: {rate}</Text>
                    <Text style={Style.info}>Price Range: {`${Math.min(...availableServices.map((service: any) => Number(service.price)))} - ${Math.max(...availableServices.map((service: any) => Number(service.price)))}`}</Text>
                </View>

                <View style={Style.section}>
                    <Text style={Style.sectionTitle}>Select Services</Text>
                    {availableServices.map((service: any) => {
                        const isSelected = selectedServices.some(
                            (s) => s.service === service.service && s.price === service.price
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