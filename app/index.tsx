import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export const unstable_settings = {
    colorScheme: 'light',
}

export default function Splash() {
    const router = useRouter();

    console.log('splash screen')
    const [loading, setLoading] = useState(true);
    const { theme, isDark } = useTheme();

    useEffect(() => {
        const checkLogin = async () => {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            const role = await AsyncStorage.getItem('role');

            if (isLoggedIn === 'true') {

                // if (role == 'Customer') {
                //     router.replace('/home'); // Go to home (index)
                // } else if (role == 'Salon') {
                //     router.replace('/salonHome'); // Go to salon (index)
                // }
                setLoading(false);
                role == 'Employee' ? router.replace('/employee/employeeHome') : role == 'Customer' ? router.replace('/customer/home') : router.replace('/salonOwner/salonHome'); // Go to employee reservation
            } else {
                router.replace('/login'); // Go to login
            }
        };
        checkLogin();
    }, []);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <StatusBar style={isDark ? 'dark' : 'light'} />
            {loading && (
                <ActivityIndicator size="large" color="#3586DB" />
            )}
        </View>
    );
}