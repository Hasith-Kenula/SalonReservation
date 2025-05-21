import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FocusableTextInput from '../../components/FocusableTextInput';
const Registration = () => {
    const [role, setRole] = useState('Customer');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


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
                    <TouchableOpacity style={Style.button} onPress={() => setRole('Salon Owner')}>
                        <Text style={Style.btnText}>Salon Owner</Text>
                    </TouchableOpacity>
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Name' : 'Salon Name'}</Text>
                    <FocusableTextInput placeholder={role == 'Customer' ? 'Enter your name' : 'Enter your salon name'}
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Email' : 'Salon Email'}</Text>
                    <FocusableTextInput placeholder="example@gmail.com"
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Phone Number' : 'Salon Phone Number'}</Text>
                    <FocusableTextInput placeholder="070 1234567"
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Location' : 'Salon Location'}</Text>
                    <FocusableTextInput placeholder={role == 'Customer' ? 'Enter your location' : 'Enter salon location'}
                        placeholderTextColor="gray"
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
                    <TouchableOpacity style={[Style.button, { alignSelf: 'center', width: '100%' }]} onPress={() => { }}>
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