import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusableTextInput from '../../components/FocusableTextInput';
const Registration = () => {
    const [role, setRole] = useState('Customer');
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [ownerName, setOwnerName] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        try {
            let apiUrl = '';
            let payload = {}

            if (role == 'Customer') {
                if (name && phone && address && password && confirmPassword) {
                    if (password == confirmPassword) {

                        apiUrl = 'http://192.168.1.2:3000/customers/register';
                        payload = {
                            fullName: name,
                            phone: phone,
                            address: address,
                            password: password
                        }
                    } else {
                        alert('Passwords do not match');
                    }

                } else {
                    alert('Please fill all the fields');
                }
            } else {
                if (name && phone && address && ownerName && password && confirmPassword) {
                    if (password == confirmPassword) {
                        apiUrl = 'http://192.168.1.2:3000/salons/register';
                        payload = {
                            salonName: name,
                            ownerName: ownerName,
                            phone: phone,
                            address: address,
                            password: password
                        }
                    } else {
                        alert('Passwords do not match');
                    }
                } else {
                    alert('Please fill all the fields');
                }
            }
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)

            });
            console.log(`Phone: ${phone}`);
            const result = await response.json();
            console.log(`Result: ${result}`);
            if (result.success) {
                alert('Registration successfully');
                router.replace('/login');
            } else {
                alert(result.message);
            }
        } catch (error) {

        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", height: '100%' }}>
            <View style={Style.headings}>
                <Text style={Style.title}>Registration</Text>
            </View>
            <ScrollView style={Style.container} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
                <View style={{ paddingBottom: 5, flexDirection: 'row', alignContent: 'center' }}>
                    <Text style={Style.subTitle}>Register as </Text>
                    <Text style={[Style.subTitle, { fontWeight: '500' }]}>{role}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={Style.button} onPress={() => setRole('Customer')}>
                        <Text style={Style.btnText}>Customer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Style.button} onPress={() => setRole('Salon')}>
                        <Text style={Style.btnText}>Salon Owner</Text>
                    </TouchableOpacity>
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Name' : 'Salon Name'}</Text>
                    <FocusableTextInput placeholder={role == 'Customer' ? 'Enter your name' : 'Enter your salon name'}
                        placeholderTextColor="gray"
                        value={name}
                        onChangeText={(text) => { setName(text) }}
                        style={Style.input} />
                </View>
                {(role == 'Salon') &&
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Owner Name</Text>
                        <FocusableTextInput placeholder="Enter owner name"
                            value={ownerName}
                            onChangeText={(text) => { setOwnerName(text) }}
                            placeholderTextColor="gray"
                            style={Style.input} />
                    </View>
                }
                {/* <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Email' : 'Salon Email'}</Text>
                    <FocusableTextInput placeholder="example@gmail.com"
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View> */}
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Phone Number' : 'Salon Phone Number'}</Text>
                    <FocusableTextInput placeholder="070 1234567"
                        value={phone}
                        onChangeText={(text) => { setPhone(text) }}
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Address' : 'Salon Address'}</Text>
                    <FocusableTextInput placeholder={role == 'Customer' ? 'Enter your address' : 'Enter salon address'}
                        placeholderTextColor="gray"
                        value={address}
                        onChangeText={(text) => { setAddress(text) }}
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Password</Text>
                    <FocusableTextInput placeholder="Enter your password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={[Style.input, { paddingRight: 40 }]}
                    />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Confirm Password</Text>
                    <FocusableTextInput placeholder="Confirm your password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        style={[Style.input, { paddingRight: 40 }]}
                    />
                </View>
                <View style={Style.inputContainer}>
                    <TouchableOpacity style={[Style.button, { alignSelf: 'center', width: '100%' }]} onPress={() => { handleRegister() }}>
                        <Text style={Style.btnText}>Register as {role == 'Customer' ? 'Customer' : 'Salon'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const Style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
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
    subTitle: {
        fontSize: 25
    },
    button: {
        backgroundColor: '#3586DB',
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
        width: '45%',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 10,
        padding: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
})
export default Registration