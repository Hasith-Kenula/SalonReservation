import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Staff = {
    staffID: string;
    salonID: string;
    staffName: string;
    staffRole: string;
    phone: string;
};

const StaffManagement = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [staffName, setStaffName] = useState('');
    const [staffRole, setStaffRole] = useState('');
    const [phone, setPhone] = useState('');
    const [staffID, setStaffID] = useState('');
    const [salonID, setSalonID] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch staff from API
    useEffect(() => {
        const fetchData = async () => {
            const salon = await AsyncStorage.getItem('user');
            if (salon) {
                const parsedSalon = JSON.parse(salon);
                setSalonID(parsedSalon.salonID);
                const response = await fetch(`http://192.168.1.2:3000/staff/${parsedSalon.salonID}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const result = await response.json();
                if (result.success) {
                    setStaffList(result.data);
                } else {
                    alert(result.message);
                }
            }
        }
        fetchData();
    }, []);

    const resetForm = () => {
        setIsEditing(false);
        setStaffName('');
        setStaffRole('');
        setPhone('');
        setStaffID('');
    };

    const handleAddStaff = async () => {
        const response = await fetch('http://192.168.1.2:3000/staff/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staffName, staffRole, phone, salonID })
        });
        const result = await response.json();
        if (result.success) {
            setStaffList([...staffList, result.data]);
            resetForm();
            alert('Staff member added successfully');
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert('Delete Staff', 'Are you sure you want to delete this staff member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    const response = await fetch(`http://192.168.1.2:3000/staff/${id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const result = await response.json();
                    if (result.success) {
                        setStaffList(staffList.filter(s => s.staffID !== id));
                        alert(result.message);
                    } else {
                        alert(result.message);
                    }
                }
            }
        ]);
    };

    const handleEdit = (item: Staff) => {
        setIsEditing(true);
        setStaffID(item.staffID);
        setStaffName(item.staffName);
        setStaffRole(item.staffRole);
        setPhone(item.phone);
    };

    const handleStaffEdit = async (item: Staff) => {
        Keyboard.dismiss();
        Alert.alert('Edit Staff', 'Are you sure you want to edit this staff member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Edit', style: 'destructive', onPress: async () => {
                    const response = await fetch(`http://192.168.1.2:3000/staff/${item.staffID}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            salonID: item.salonID,
                            staffName: item.staffName,
                            staffRole: item.staffRole,
                            phone: item.phone
                        })
                    });
                    const result = await response.json();
                    if (result.success) {
                        setStaffList(staffList.map(s => s.staffID === item.staffID ? { ...s, staffName: item.staffName, staffRole: item.staffRole, phone: item.phone } : s));
                        resetForm();
                    } else {
                        alert(result.message);
                    }
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={styles.heading}>
                <Text style={styles.title}>Staff Management</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.form}>
                    {isEditing && (
                        <TextInput
                            style={[styles.input, { color: 'gray' }]}
                            placeholderTextColor='gray'
                            value={`StaffID: ${staffID}`}
                            editable={false}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Staff Name"
                        placeholderTextColor='gray'
                        value={staffName}
                        onChangeText={setStaffName}
                        keyboardType='default'
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Role"
                        placeholderTextColor='gray'
                        value={staffRole}
                        onChangeText={setStaffRole}
                        keyboardType='default'
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        placeholderTextColor='gray'
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    {isEditing ? (
                        <TouchableOpacity style={styles.addButton} onPress={() => handleStaffEdit({
                            staffID: staffID,
                            salonID: salonID,
                            staffName: staffName,
                            staffRole: staffRole,
                            phone: phone
                        })}>
                            <Text style={styles.addButtonText}>Edit Staff</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.addButton} onPress={handleAddStaff}>
                            <Text style={styles.addButtonText}>Add Staff</Text>
                        </TouchableOpacity>
                    )}
                    {staffID && (
                        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                            <Text style={styles.cancelButtonText}>Cancel Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.sectionTitle}>Staff Members</Text>
                <FlatList
                    data={staffList}
                    keyExtractor={item => item.staffID}
                    renderItem={({ item }) => (
                        <View style={styles.staffCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.staffName}>{item.staffName}</Text>
                                <Text style={styles.staffDetail}>Role: {item.staffRole}</Text>
                                <Text style={styles.staffDetail}>Phone: {item.phone}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                                <Text style={{ color: '#3586DB', fontWeight: 'bold' }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.staffID)} style={styles.deleteBtn}>
                                <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No staff members added yet.</Text>}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', padding: 15 },
    title: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontSize: 30,
        paddingBottom: 10,
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
    staffCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, elevation: 1 },
    staffName: { fontSize: 17, fontWeight: 'bold', color: '#3586DB' },
    staffDetail: { fontSize: 14, color: '#555' },
    editBtn: { marginLeft: 10, padding: 6 },
    deleteBtn: { marginLeft: 6, padding: 6 },
});

export default StaffManagement;