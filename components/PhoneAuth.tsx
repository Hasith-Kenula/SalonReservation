// components/PhoneAuth.tsx
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { auth } from '../firebaseConfig';

type Props = {
    onVerified: (phoneNumber: string) => void;
};

const PhoneAuth = ({ onVerified }: Props) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const sendVerification = async () => {
        try {
            const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: 'invisible',
            });

            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmation.verificationId);
            alert('OTP sent!');
        } catch (err) {
            alert('Error sending OTP: ' + err);
        }
    };

    const confirmCode = async () => {
        try {
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
            await signInWithCredential(auth, credential);
            setIsVerified(true);
            onVerified(phoneNumber);
            alert('Phone verified!');
        } catch (err) {
            alert('Invalid code: ' + err);
        }
    };

    return (
        <View>
            {!isVerified ? (
                <>
                    <Text>Phone Number:</Text>
                    <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+94701234567" keyboardType="phone-pad" />
                    <Button title="Send OTP" onPress={sendVerification} />
                    <TextInput value={verificationCode} onChangeText={setVerificationCode} placeholder="Enter OTP" keyboardType="number-pad" />
                    <Button title="Verify OTP" onPress={confirmCode} />
                </>
            ) : (
                <Text>Phone verified ✅</Text>
            )}
            <View id="recaptcha-container" />
        </View>
    );
};

export default PhoneAuth;
