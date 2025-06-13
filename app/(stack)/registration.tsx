import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StatusBox from '@/components/StatusBox';
import FocusableTextInput from '../../components/FocusableTextInput';



const Registration = () => {
    const [role, setRole] = useState('Customer');
    const [showPassword, setShowPassword] = useState(false);
    const [statusBox, setStatusBox] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const [otp, setOtp] = useState('')
    const [showOTPBox, setShowOTPBox] = useState(false);
    const [editable, setEditable] = useState(true)

    const [otpLoader, setOtpLoader] = useState(false)

    const validateEmail = (email: string) => {
        setEmail(email);
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(re.test(String(email).toLowerCase()));
    }

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
    const sendOTP = async () => {
        setOtpLoader(true)
        try {
            const response = await fetch('http://192.168.1.2:3000/email/sendOTP', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
            const result = await response.json();
            if (result.success) {
                setStatusBox({
                    message: result.message,
                    type: 'success',
                })
                setShowOTPBox(true);
                setEditable(false)
            } else {
                setStatusBox({
                    message: result.message,
                    type: 'error',
                })
            }
        } catch (error) {

        } finally {
            setOtpLoader(false)
        }
    }
    const verifyOTP = async () => {
        setOtpLoader(true);
        try {
            const response = await fetch('http://192.168.1.2:3000/email/verifyOTP', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: otp, email: email })
            })
            const result = await response.json();
            if (result.success) {
                setStatusBox({
                    message: result.message,
                    type: 'success',
                })
                setShowOTPBox(false);
                setIsEmailVerified(true)
            } else {
                setStatusBox({
                    message: result.message,
                    type: 'error',
                })
            }
        } catch (error) {

        } finally {
            setOtpLoader(false)
        }
    }
    const EmailAuth = () => {
        return (
            <View style={Style.inputContainer}>
                <FocusableTextInput value={otp} onChangeText={setOtp} placeholder="Enter OTP" />
                <TouchableOpacity style={[Style.button, { width: '100%' }]} onPress={verifyOTP}>
                    <Text style={Style.btnText}>
                        Verify OTP
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {statusBox && (
                <StatusBox message={statusBox.message} type={statusBox.type} onHide={() => setStatusBox(null)} />
            )}
            <SafeAreaView style={{ backgroundColor: "white", flex: 1 }} edges={['top', 'left', 'right']}>
                <View style={Style.headings}>
                    <Text style={Style.title}>Registration</Text>
                </View>

                <ScrollView style={Style.container} keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled'>
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
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    {(role == 'Salon') &&
                        <View style={Style.inputContainer}>
                            <Text style={Style.label}>Owner Name</Text>
                            <FocusableTextInput placeholder="Enter owner name"
                                value={ownerName}
                                onChangeText={setOwnerName}
                                placeholderTextColor="gray"
                            />
                        </View>
                    }
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>{role == 'Customer' ? 'Email' : 'Salon Email'}</Text>
                        <FocusableTextInput placeholder="example@gmail.com"
                            autoCapitalize='none'
                            autoComplete='email'
                            value={email}
                            editable={editable}
                            onChangeText={validateEmail}
                            style={[isEmailVerified && { backgroundColor: 'rgba(0, 255, 34, 0.24)' }, !isEmailValid && email && Style.emailInputError]} />
                        {!isEmailValid && email && <Text style={{ color: 'red', fontSize: 12 }}>Please enter a valid email address</Text>}
                    </View>
                    {otpLoader && (
                        <ActivityIndicator size="small" color="#3586DB" />
                    )}
                    {email && !isEmailVerified && isEmailValid && (
                        <View style={[Style.inputContainer]}>
                            <TouchableOpacity style={[Style.button, { width: '100%' }]} onPress={sendOTP}>
                                <Text style={Style.btnText}>Send Verification Code</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {showOTPBox && (
                        EmailAuth()
                    )
                    }
                    {/* <PhoneAuth onVerified={(verifiedPhome) => { setPhone(verifiedPhome); setIsPhoneVerified(true) }} /> */}

                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>{role == 'Customer' ? 'Phone Number' : 'Salon Phone Number'}</Text>
                        <FocusableTextInput placeholder="070 1234567"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>{role == 'Customer' ? 'Address' : 'Salon Address'}</Text>
                        <FocusableTextInput placeholder={role == 'Customer' ? 'Enter your address' : 'Enter salon address'}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Password</Text>
                        <FocusableTextInput placeholder="Enter your password"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            style={[{ paddingRight: 40 }]}
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Confirm Password</Text>
                        <FocusableTextInput placeholder="Confirm your password"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={[{ paddingRight: 40 }]}
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <TouchableOpacity style={[Style.button, { alignSelf: 'center', width: '100%' }]} onPress={() => { handleRegister() }}>
                            <Text style={Style.btnText}>Register as {role == 'Customer' ? 'Customer' : 'Salon'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
    verifiedEmail: {
        backgroundColor: 'rgba(0, 255, 34, 0.24)',
        borderColor: 'rgba(0, 255, 34, 0.24)',
    },
    emailInputError: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: 'red',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
})
export default Registration