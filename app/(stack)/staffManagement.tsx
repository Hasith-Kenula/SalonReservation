import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Employee = {
    empID: string;

    fullName: string;
    password: string;
    phone: string;
};

const StaffManagement = () => {
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [fullName, setfullName] = useState('');
    const [password, setpassword] = useState('');
    const [phone, setPhone] = useState('');
    const [empID, setempID] = useState('');
    const [salonID, setSalonID] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch staff from API
    useEffect(() => {
        const fetchData = async () => {
            const salon = await AsyncStorage.getItem('user');
            if (salon) {
                const parsedSalon = JSON.parse(salon);
                setSalonID(parsedSalon.salonID);
                const response = await fetch(`http://192.168.1.2:3000/employees/${parsedSalon.salonID}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const result = await response.json();
                if (result.success) {
                    setEmployeeList(result.data);
                } else {
                    alert(result.message);
                }
            }
        }
        fetchData();
    }, []);

    const resetForm = () => {
        setIsEditing(false);
        setfullName('');
        setpassword('');
        setPhone('');
        setempID('');
    };

    const handleAddEmployee = async () => {
        if (fullName && password && phone) {
            Keyboard.dismiss();
            const response = await fetch('http://192.168.1.2:3000/employees/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, password, phone, salonID })
            });
            const result = await response.json();
            if (result.success) {
                setEmployeeList([...employeeList, result.data]);
                resetForm();
                alert(result.message);
            } else {
                alert(result.message);
            }
        } else {
            alert('Please fill all fields');
        }
    };

    const handleDelete = async (id: string) => {

        Alert.alert('Delete Staff', 'Are you sure you want to delete this staff member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    const response = await fetch(`http://192.168.1.2:3000/employees/${id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const result = await response.json();
                    if (result.success) {
                        setEmployeeList(employeeList.filter(s => s.empID !== id));
                        alert(result.message);
                    } else {
                        alert(result.message);
                    }
                }
            }
        ]);
    };

    const handleEdit = (item: Employee) => {
        setIsEditing(true);
        setempID(item.empID);
        setfullName(item.fullName);
        setpassword(item.password);
        setPhone(item.phone);
    };

    const handleStaffEdit = async (item: Employee) => {
        Keyboard.dismiss();
        Alert.alert('Edit Staff', 'Are you sure you want to edit this staff member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Edit', style: 'destructive', onPress: async () => {
                    const response = await fetch(`http://192.168.1.2:3000/staff/${item.empID}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fullName: item.fullName,
                            password: item.password,
                            phone: item.phone
                        })
                    });
                    const result = await response.json();
                    if (result.success) {
                        setEmployeeList(employeeList.map(s => s.empID === item.empID ? { ...s, fullName: item.fullName, password: item.password, phone: item.phone } : s));
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
                            value={`StaffID: ${empID}`}
                            editable={false}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Employee Name"
                        placeholderTextColor='gray'
                        value={fullName}
                        onChangeText={setfullName}
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
                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        placeholderTextColor='gray'
                        value={password}
                        onChangeText={setpassword}
                        keyboardType='default'
                    />
                    {isEditing ? (
                        <TouchableOpacity style={styles.addButton} onPress={() => handleStaffEdit({
                            empID: empID,
                            fullName: fullName,
                            password: password,
                            phone: phone
                        })}>
                            <Text style={styles.addButtonText}>Edit Employee</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
                            <Text style={styles.addButtonText}>Add Employee</Text>
                        </TouchableOpacity>
                    )}
                    {empID && (
                        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                            <Text style={styles.cancelButtonText}>Cancel Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.sectionTitle}>Staff Members</Text>
                <FlatList
                    data={employeeList}
                    keyExtractor={item => item.empID}
                    renderItem={({ item }) => (
                        <View style={styles.staffCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.staffName}>{item.fullName}</Text>
                                <Text style={styles.staffDetail}>password: {item.password}</Text>
                                <Text style={styles.staffDetail}>Phone: {item.phone}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                                <Text style={{ color: '#3586DB', fontWeight: 'bold' }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.empID)} style={styles.deleteBtn}>
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