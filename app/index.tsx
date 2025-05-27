import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

export default function Splash() {
    const router = useRouter();

    console.log('splash screen')
    const [loading, setLoading] = useState(true);

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
                role == 'Employee' ? router.replace('/employeeHome') : role == 'Customer' ? router.replace('/home') : router.replace('/salonHome'); // Go to employee reservation
            } else {
                router.replace('/login'); // Go to login
            }
        };
        checkLogin();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar barStyle="dark-content" />
            {loading && (
                <ActivityIndicator size="large" color="#3586DB" />
            )}
        </View>
    );
}