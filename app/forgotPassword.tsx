import FocusableTextInput from '@/components/FocusableTextInput';
import StatusBox from '@/components/StatusBox';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EmailIcon = () => {
    return (
        <MaterialIcons name="email" size={28} color="gray" />
    );
}
const ConfirmationIcon = () => {
    return (
        <MaterialIcons name="confirmation-number" size={28} color="gray" />
    );
}
const PasswordIcon = () => {
    return (
        <MaterialCommunityIcons name="lock" size={28} color="gray" />
    );
}
type StatusBox = {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [OTPLoader, setOTPLoader] = useState(false);
    const [isOTPsent, setIsOTPsent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const [statusBox, setStatusBox] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null)

    const validateEmail = (email: string) => {
        setEmail(email);
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(re.test(String(email).toLowerCase()));
    }
    const sendVerificationCode = async () => {
        try {
            setOTPLoader(true);
            console.log(`Sending verification code to ${email}`);

            const response = await fetch(`http://192.168.1.2:3000/email/sendOTP`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, passwordChange: true }),
            });
            const data = await response.json();
            if (data.success) {
                setIsOTPsent(true);
                setStatusBox({ type: 'success', message: 'Verification code sent successfully!' });
            } else {
                setStatusBox({ type: 'error', message: data.message || 'Failed to send verification code' });
            }
        } catch (error) {

        } finally {
            setOTPLoader(false);
        }


    }
    const verifyCode = async () => {
        try {
            console.log(`Verifying code ${verificationCode} for email ${email}`);
            const response = await fetch(`http://192.168.1.2:3000/email/verifyOTP`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, otp: verificationCode }),
            });
            const data = await response.json();
            if (data.success) {
                setIsEmailVerified(true);
                setStatusBox({ type: 'success', message: 'Verification successful!' });
                setIsOTPsent(false);
            }
            else {
                setStatusBox({ type: 'error', message: data.message || 'Failed to verify code' });
            }
        } catch (error) {

        }
    }
    const changePassword = async () => {
        try {
            if (newPassword.length < 8 || newPassword !== confirmPassword) {
                setStatusBox({ type: 'error', message: 'Password must be at least 8 characters long and match the confirmation.' });
                return;
            }

            const response = await fetch(`http://192.168.1.2:3000/password_change/forgot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, newPassword: newPassword }),
            });
            const data = await response.json();
            if (data.success) {
                setStatusBox({ type: 'success', message: 'Password changed successfully!' });
                setEmail('');
                setVerificationCode('');
                setIsEmailValid(false);
                setIsOTPsent(false);
                setNewPassword('');
                setConfirmPassword('');
                setIsEmailVerified(false);
            } else {
                setStatusBox({ type: 'error', message: data.message || 'Failed to change password' });
            }
        } catch (error) {

        }
    }
    return (
        <SafeAreaView style={{ flex: 1, }} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {statusBox && <StatusBox message={statusBox.message} type={statusBox.type} onHide={() => setStatusBox(null)} />}
                {/* <StatusBar style="dark" /> */}
                <View style={Styles.heading}>
                    <Text style={Styles.title}>Change Password</Text>
                </View>
                <ScrollView contentContainerStyle={Styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    <View style={Styles.mainContainer}>
                        <View style={Styles.section}>
                            <Text style={Styles.description}>Verify your email to change your password securely</Text>
                            <View style={Styles.inputContainer}>
                                <FocusableTextInput
                                    placeholder='Email Address'
                                    Icon={EmailIcon()}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    value={email}
                                    color={isEmailVerified ? 'gray' : 'black'}
                                    readOnly={isEmailVerified}
                                    onChangeText={validateEmail}
                                    style={[!isEmailValid && email ? Styles.inputError : undefined, isEmailVerified && { backgroundColor: 'rgba(0, 255, 34, 0.24)', color: 'gray' }]} />
                            </View>
                            {!isEmailValid && email && <Text style={{ color: 'red', fontSize: 12 }}>Please enter a valid email address</Text>}
                            {OTPLoader && (
                                <ActivityIndicator size="small" color="#3586DB" style={Styles.loader} />
                            )}
                            <TouchableOpacity style={[Styles.button, !isEmailValid && Styles.buttonDisable, isEmailVerified && Styles.buttonDisable]} disabled={!isEmailValid || isEmailVerified} onPress={sendVerificationCode}>
                                <Text style={Styles.btnText}>Send Verification Code</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.section}>
                            <Text style={Styles.description}>Enter the verification code sent to your email</Text>
                            <Text style={Styles.description}>A verification code has been sent to your email</Text>
                            <View style={Styles.inputContainer}>
                                <FocusableTextInput placeholder='Verification Code'
                                    Icon={ConfirmationIcon()}
                                    maxLength={6}
                                    keyboardType='number-pad'
                                    readOnly={!isOTPsent}
                                    color={isEmailVerified ? 'gray' : 'black'}
                                    value={verificationCode}
                                    onChangeText={(text) => setVerificationCode(text)}
                                />
                            </View>
                            <TouchableOpacity style={[Styles.button, verificationCode.length != 6 && Styles.buttonDisable, isEmailVerified && Styles.buttonDisable]} disabled={verificationCode.length != 6 || isEmailVerified} onPress={verifyCode}>
                                <Text style={Styles.btnText}>Verify Code</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.section}>
                            <Text style={Styles.description}>Set a new strong password for secure your account</Text>
                            <View style={[Styles.inputContainer, { display: 'flex', flexDirection: 'column', gap: 10 }]}>
                                <FocusableTextInput
                                    placeholder='New Password'
                                    Icon={PasswordIcon()}
                                    secureTextEntry={true}
                                    value={newPassword}
                                    readOnly={!isEmailVerified}
                                    onChangeText={setNewPassword}
                                    style={[newPassword.length > 0 && newPassword.length < 8 && Styles.inputError]} />

                                {newPassword.length > 0 && newPassword.length < 8 && newPassword && <Text style={{ color: 'red', fontSize: 12, alignSelf: 'flex-start' }}>Password must be at least 8 characters long</Text>}

                                <FocusableTextInput
                                    placeholder='Confirm Password'
                                    Icon={PasswordIcon()}
                                    secureTextEntry={true}
                                    value={confirmPassword}
                                    readOnly={newPassword.length < 8}
                                    onChangeText={setConfirmPassword}
                                    style={[newPassword && confirmPassword && newPassword !== confirmPassword && Styles.inputError]} />

                                {newPassword && confirmPassword && newPassword !== confirmPassword && <Text style={{ color: 'red', fontSize: 12, alignSelf: 'flex-start' }}>Passwords do not match</Text>}
                            </View>
                            <TouchableOpacity
                                style={[Styles.button, (!(newPassword.length > 0) || (newPassword !== confirmPassword)) || (!isEmailValid) ? Styles.buttonDisable : null]}
                                disabled={(newPassword.length < 8 || newPassword !== confirmPassword) || !isEmailVerified}
                                onPress={changePassword}>
                                <Text style={Styles.btnText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
const Styles = StyleSheet.create({
    title: {
        color: "#3586DB",
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontSize: 24,
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
    scrollContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    section: {
        marginBottom: 30,
    },
    loader: {
        marginTop: 10,
        alignSelf: 'center',
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    description: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#3586DB',
        padding: 10,
        borderRadius: 5,
        height: 50,
        justifyContent: 'center',
    },

    btnText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonDisable: {
        // backgroundColor: '#B0C4DE',
        opacity: 0.8,
    },
    inputError: {
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
});
export default ForgotPassword