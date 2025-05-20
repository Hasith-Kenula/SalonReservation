import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const Registration = () => {
    const [role, setRole] = useState('Customer');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={Style.container} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
                <Text style={Style.title}>Register</Text>
                <Text style={{ paddingBottom: 5 }}>Register as {role}</Text>
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
                    <TextInput placeholder={role == 'Customer' ? 'Enter your name' : 'Enter your salon name'}
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Email' : 'Salon Email'}</Text>
                    <TextInput placeholder="example@gmail.com"
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Phone Number' : 'Salon Phone Number'}</Text>
                    <TextInput placeholder="070 1234567"
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>{role == 'Customer' ? 'Location' : 'Salon Location'}</Text>
                    <TextInput placeholder={role == 'Customer' ? 'Enter your location' : 'Enter salon location'}
                        placeholderTextColor="gray"
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Password</Text>
                    <TextInput placeholder="Enter your password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={[Style.input, { paddingRight: 40 }]}
                    />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Confirm Password</Text>
                    <TextInput placeholder="Confirm your password"
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
        paddingLeft: 10,
        paddingRight: 10,
        margin: 5,
        marginTop: 0,

    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
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