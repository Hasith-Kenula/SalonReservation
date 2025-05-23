import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FocusableTextInput from '../../components/FocusableTextInput';

const EditProfile = () => {

    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [salonID, setSalonID] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [ownerName, setOwnerName] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const userJson = await AsyncStorage.getItem('user');
            const _role = await AsyncStorage.getItem('role');
            if (userJson && _role) {
                try {
                    const user = JSON.parse(userJson);

                    setUser(user);

                    setPhone(user.phone);
                    setAddress(user.address);
                    setRole(_role)

                    if (_role == 'Customer') {
                        setCustomerID(user.customerID)
                        setName(user.fullName);
                    } else {
                        setSalonID(user.salonID);
                        setName(user.salonName);
                        setOwnerName(user.ownerName);
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchUser();
    }, []);

    const handleSave = async () => {
        console.log("click Save");
        try {
            let updatedUser;
            let apiUrl = '';
            let payload = {};
            if (role == 'Customer') {
                updatedUser = {
                    ...user,
                    fullName: name,
                    phone: phone,
                    address: address,
                }
                apiUrl = 'http://192.168.1.2:3000/customers/update';
                payload = {
                    customerID: customerID,
                    fullName: name,
                    phone: phone,
                    address: address
                };


            } else {
                updatedUser = {
                    ...user,
                    salonName: name,
                    ownerName: ownerName,
                    phone: phone,
                    address: address,
                }
                apiUrl = 'http://192.168.1.2:3000/salons/update'
                payload = {
                    salonID: salonID,
                    salonName: name,
                    ownerName: ownerName,
                    phone: phone,
                    address: address
                }



            }
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.success) {
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                alert(result.message);
            } else {
                alert('Failed to update profile');
                console.log(`URL: ${apiUrl} \n Payload: ${JSON.stringify(payload)} \n Response: ${JSON.stringify(result)}`);
            }


        } catch (error) {
            console.log(error)
        }
    }
    return (
        <SafeAreaView style={{ marginHorizontal: 10, height: '100%' }}>
            <View style={Style.headings}>
                <Text style={Style.title}>Edit</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>
                <Text style={[Style.subTitle]}>{role == 'Customer' ? 'User' : 'Salon'} Profile</Text>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Full' : 'Salon'} Name</Text>
                    <FocusableTextInput placeholder="Enter your name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </View>
                {/* <View style={Style.inputContainer}>
                    <Text style={Style.label}>Email</Text>
                    <FocusableTextInput placeholder="Enter your email"
                        value
                        onChangeText={(text) => { }}
                    />
                </View> */}
                {role == 'Salon' && (
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Owner Name</Text>
                        <FocusableTextInput placeholder="Owner Name"
                            value={ownerName}
                            onChangeText={(text) => { setOwnerName(text) }}
                        />
                    </View>
                )}
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Phone Number</Text>
                    <FocusableTextInput placeholder="Enter phone number" value={phone} onChangeText={(text) => { setPhone(text) }}
                    />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Location</Text>
                    <FocusableTextInput placeholder="Enter your location" value={address} onChangeText={(text) => { setAddress(text) }}
                    />
                </View>

                <View style={Style.passowrdContainer}>
                    <Text style={{ fontSize: 23, marginBottom: 10, fontWeight: '500' }}>Change Password</Text>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Current Password</Text>
                        <FocusableTextInput placeholder="Enter your current password"
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>New Password</Text>
                        <FocusableTextInput placeholder="Enter your new password"
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Confirm New Password</Text>
                        <FocusableTextInput placeholder="Confirm your new password"
                        />
                    </View>
                </View>
                <TouchableOpacity style={[Style.button, { padding: 5 }]} onPress={() => { handleSave() }}>
                    <Text style={Style.btnText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
const Style = StyleSheet.create({
    title: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
    },
    subTitle: {
        alignSelf: 'center',
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
    },
    headings: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 10,
        padding: 5,
    },
    input: {
        backgroundColor: 'transparent',
        padding: 10,
        height: 50,
    },
    label: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold',

    },
    button: {
        backgroundColor: '#3586DB',
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    passowrdContainer: {
        flexDirection: 'column',
        marginTop: 20,
        padding: 5,
        borderTopColor: 'gray',
        borderTopWidth: 1,
    },


})
export default EditProfile