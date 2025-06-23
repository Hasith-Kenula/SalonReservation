import ServiceCard from '@/components/ServiceCard';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// const initialServices = [
//     { id: '1', name: 'Haircut', price: '2000', duration: '30' },
//     { id: '2', name: 'Coloring', price: '3500', duration: '60' },
// ];

type Service = {
    serviceID: string;
    salonID: string;
    serviceName: string;
    servicePrice: number;
    durationMinutes: number;
};

const THEME_COLOR = '#3586DB';

const ServiceManagement = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [durationMinutes, setServiceDuration] = useState('');
    const [serviceID, setServiceID] = useState('');
    const [salonID, setSalonID] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    //fetch initial service data from API
    useEffect(() => {
        const fetchData = async () => {
            const salon = await AsyncStorage.getItem('user');
            if (salon) {
                const parsedSalon = JSON.parse(salon);
                setSalonID(parsedSalon.salonID);
                console.log(`SalonID: ${salonID}`);
                console.log(`SalonID: ${parsedSalon.salonID}`);
                const response = await fetch(`http://192.168.1.2:3000/services/${parsedSalon.salonID}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const result = await response.json();
                console.log("Data: " + result.data);

                if (result.success) {
                    setServices(result.data);
                    setLoading(false);
                } else {
                    Alert.alert('Error', result.message);
                    console.log(result.message);
                    setLoading(false);
                }
            }

        }
        fetchData();
    }, []);

    const resetForm = () => {
        setIsEditing(false);
        setServiceName('');
        setServicePrice('');
        setServiceDuration('');
        setServiceID('');
    };

    const handleAddService = async () => {
        if (serviceName && servicePrice && durationMinutes) {

            const response = await fetch('http://192.168.1.2:3000/services/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serviceName, servicePrice, durationMinutes, salonID })
            })
            const result = await response.json();
            if (result.success) {
                setServices([...services, result.data]);
                resetForm();
                alert('Service added successfully');
            } else {
                console.log(result.message);
                alert(result.message);
            }
        } else {
            alert('Please fill all fields');
        }
    }

    // const handleDelete = (id) => {
    //     Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
    //         { text: 'Cancel', style: 'cancel' },
    //         {
    //             text: 'Delete', style: 'destructive', onPress: () => {
    //                 setServices(services.filter(s => s.id !== id));
    //                 if (editingId === id) resetForm();
    //             }
    //         }
    //     ]);
    // };
    const handleDelete = async (id: string) => {
        Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    const response = await fetch(`http://192.168.1.2:3000/services/${id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    })
                    const result = await response.json();
                    if (result.success) {
                        setServices(services.filter(s => s.serviceID !== id));
                        alert(result.message);
                    } else {
                        console.log(result.message);
                        alert(result.message);
                    }
                }
            }
        ])
    }
    const handleEdit = async (item: Service) => {
        setIsEditing(true);
        setServiceID(item.serviceID);
        setServiceName(item.serviceName);
        setServicePrice(item.servicePrice.toString());
        setServiceDuration(item.durationMinutes.toString());
    }

    const handleServiceEdit = async (item: Service) => {
        Keyboard.dismiss();
        Alert.alert('Edit Service', 'Are you sure you want to edit this service?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Edit', style: 'destructive', onPress: async () => {
                    const response = await fetch(`http://192.168.1.2:3000/services/${item.serviceID}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            salonID: item.salonID,
                            serviceName: item.serviceName,
                            servicePrice: item.servicePrice,
                            durationMinutes: item.durationMinutes
                        })
                    })
                    const result = await response.json();
                    if (result.success) {
                        setServices(services.map(s => s.serviceID === item.serviceID ? { ...s, serviceName: item.serviceName, servicePrice: item.servicePrice, durationMinutes: item.durationMinutes } : s));
                        resetForm();
                        // alert(result.message);

                    } else {
                        console.log(result.message);
                        alert(result.message);
                    }
                }
            }
        ]);
    }
    // if (loading) {
    //     return (
    //         <View style={styles.center}>
    //             <ActivityIndicator size="large" color={THEME_COLOR} />
    //         </View>
    //     );
    // }
    const STYLE = {
        background: theme.colors.tonal_a0,
        textColor: theme.colors.textColor,

        InputContainer: {
            background: theme.colors.tonal_a10
        }

    }
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: STYLE.background }}>
            <View style={styles.heading}>
                <Text style={[styles.title, { color: STYLE.textColor }]}>Service Management</Text>
            </View>
            <View style={[styles.container]}>
                <View style={[styles.form, { backgroundColor: STYLE.InputContainer.background }]}>
                    {isEditing && (
                        <TextInput
                            style={[styles.input, { color: STYLE.textColor }]}
                            placeholderTextColor='gray'
                            value={`ServiceID: ${serviceID}`}
                            readOnly
                        />
                    )}
                    <TextInput
                        style={[styles.input, { color: STYLE.textColor }]}
                        placeholder="Service Name"
                        placeholderTextColor='gray'

                        value={serviceName.toString()}
                        onChangeText={setServiceName}
                        keyboardType='default'
                    />
                    <TextInput
                        style={[styles.input, { color: STYLE.textColor }]}
                        placeholder="Price (LKR)"
                        placeholderTextColor='gray'
                        value={servicePrice.toString()}
                        onChangeText={setServicePrice}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, { color: STYLE.textColor }]}
                        placeholder="Duration (minutes)"
                        placeholderTextColor='gray'
                        value={durationMinutes.toString()}
                        onChangeText={setServiceDuration}
                        keyboardType="numeric"
                    />
                    {isEditing ? (
                        <TouchableOpacity style={styles.addButton} onPress={() => handleServiceEdit({
                            serviceID: serviceID,
                            salonID: salonID,
                            serviceName: serviceName,
                            servicePrice: Number(servicePrice),
                            durationMinutes: Number(durationMinutes)
                        })}>
                            <Text style={styles.addButtonText}>Edit Service</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
                            <Text style={styles.addButtonText}>Add Service</Text>
                        </TouchableOpacity>
                    )}
                    {serviceID && (
                        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                            <Text style={styles.cancelButtonText}>Cancel Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={[styles.sectionTitle, { color: STYLE.textColor }]}>Services</Text>
                {loading && (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={THEME_COLOR} />
                    </View>
                )}
                {!loading && (
                    <FlatList
                        data={services}
                        keyExtractor={item => item.serviceID}
                        renderItem={({ item }) => (
                            <ServiceCard
                                service={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                        ListEmptyComponent={<Text style={{ color: theme.colors.tonal_a50, textAlign: 'center' }}>No services added yet.</Text>}
                    />
                )}
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    title: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
    },
    heading: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(131, 131, 131, 0.51)',
        borderBottomWidth: 1,
    },

    form: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 18, elevation: 2 },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        padding: 8,
        fontSize: 16
    },
    addButton: { backgroundColor: '#3586DB', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8 },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { alignItems: 'center', marginTop: 6 },
    cancelButtonText: { color: '#888', fontSize: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#222' },
    serviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, elevation: 1 },
    serviceName: { fontSize: 17, fontWeight: 'bold', color: '#3586DB' },
    serviceDetail: { fontSize: 14, color: '#555' },
    editBtn: { marginLeft: 10, padding: 6 },
    deleteBtn: { marginLeft: 6, padding: 6 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ServiceManagement;