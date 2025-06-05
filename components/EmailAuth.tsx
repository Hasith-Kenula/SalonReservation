import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import FocusableTextInput from './FocusableTextInput'

const EmailAuth = () => {
    const [otp, setOtp] = useState('')
    const [status, setStatus] = useState('')
    const veryOTP = async () => {
        if (!otp) {
            setStatus('Please enter OTP')
            return alert('Please enter OTP')
        }
        try {
            const response = await fetch('http://192.168.1.100:3000/email/verifyOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'email',
                    otp: otp
                })
            });
            const result = await response.json();
            if (result.success) {

            };

        } catch (error) {

        }
    }
    return (
        <View>
            <FocusableTextInput />
            <Text>{status}</Text>
            <TouchableOpacity>
                <Text>
                    Verify OTP
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default EmailAuth