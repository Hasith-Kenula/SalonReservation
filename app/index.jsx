import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

export default function Splash() {
    const router = useRouter();
    console.log('splash screen')
    useEffect(() => {
        const checkLogin = async () => {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            const role = await AsyncStorage.getItem('role');
            if (isLoggedIn === 'true') {

                if (role == 'Customer') {
                    router.replace('/home'); // Go to home (index)
                } else if (role == 'Salon') {
                    router.replace('/salonHome'); // Go to salon (index)
                }

            } else {
                router.replace('/login'); // Go to login
            }
        };
        checkLogin();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar barStyle="dark-content" />
            <ActivityIndicator size="large" color='#3586DB' />
        </View>
    );
}