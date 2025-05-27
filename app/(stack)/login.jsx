import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusableTextInput from '../../components/FocusableTextInput';

function Login() {

    const AppName = 'Salon App';

    const navigation: any = useNavigation();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        console.log("clicked");
        if (username && password) {
            try {
                let apiUrl = '';

                if (role == 'Customer') {
                    apiUrl = 'http://192.168.1.2:3000/customers/login';

                } else if (role == 'Salon') {
                    apiUrl = 'http://192.168.1.2:3000/salons/login'
                } else {
                    apiUrl = 'http://192.168.1.2:3000/employees/login'
                }
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: username, password: password })

                });
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    await AsyncStorage.setItem('user', JSON.stringify(data.data));
                    await AsyncStorage.setItem('role', role);

                    //role == 'Customer' ? router.replace('/home') : role == 'Salon' ? router.replace('/salonHome') : router.replace('/employeeHome');
                    // if (role == 'Customer') {
                    //     router.replace('/home'); // Go to home (index)
                    // } else if (role == 'Salon') {
                    //     router.replace('/salonHome'); // Go to salon home
                    // }
                    // else if (role == 'Employee') {
                    //     router.replace('/employeeHome'); // Go to employee home
                    // }
                    router.replace('/')

                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Something went wrong!' + error);
            }
        } else {
            alert('Please fill in all fields');
        }
    }

    return (
        <SafeAreaView style={Style.mainContainer}>
            <StatusBar barStyle='dark-content' />
            <View style={[Style.title]}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3586DB' }}>Welcome to {AppName}</Text>
            </View>
            <View>
                <Text style={Style.label}>Select your role:</Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                <TouchableOpacity style={[Style.button, { width: '45%' }]} onPress={() => { setRole('Customer') }}>
                    <Text style={Style.btnText}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.button, { width: '45%' }]} onPress={() => { setRole('Salon') }}>
                    <Text style={Style.btnText}>Salon Owner</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.button, { width: '45%' }]} onPress={() => { setRole('Employee') }}>
                    <Text style={Style.btnText}>Employee</Text>
                </TouchableOpacity>
            </View>
            <View style={Style.formContainer}>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Phone Number</Text>
                    <FocusableTextInput placeholder="ex: 0701234567"
                        placeholderTextColor="gray"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        style={Style.input}
                        keyboardType="phone-pad" />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Password</Text>
                    <FocusableTextInput placeholder="Enter your password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={Style.input} />
                </View>
                <TouchableOpacity style={[Style.button]} onPress={() => { handleLogin() }}>
                    <Text style={Style.btnText}>Login as {role}</Text>
                </TouchableOpacity>
                <View style={{ paddingTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Don't have an account?{' '}</Text>
                    <Pressable style={{}} onPress={() => {
                        router.push('/registration');
                    }}>
                        <Text style={{ color: '#3586DB', fontWeight: 'bold', textDecorationLine: 'underline' }}> Register</Text>
                    </Pressable>
                </View>
                <View>
                    <Text>Forgot Password?</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
const Style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
    },
    title: {
        flex: 5,
        justifyContent: 'center',
        marginTop: 50,
        alignItems: 'center',
    },
    formContainer: {
        flex: 15,
        justifyContent: 'center',
    },
    inputContainer: {

        marginBottom: 10,
        padding: 5,
    },
    passwordContainer: {

        flexDirection: 'row',
    },
    visibleIcon: {
        position: 'absolute',
        alignSelf: 'center',
        right: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 5

    },
    input: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    button: {

        height: 50,
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#3586DB',
        borderRadius: 5,
    },
    btnText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
export default Login