import { ThemeProvider } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { SocketProvider } from '../socket/socketProvider';


const _layout = () => {
    const [customerID, setCustomerID] = useState<string | null>(null);
    const [salonID, setSalonID] = useState<string | null>(null);
    const [employeeID, setEmployeeID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadIDs = async () => {
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            console.log('Loaded user:', user);
            setCustomerID(user?.customerID || null);
            setSalonID(user?.salonID || null);
            setEmployeeID(user?.employeeID || null);
            setLoading(false);
        };
        loadIDs();
    }, []);
    if (loading) { return null; }
    return (
        <SocketProvider customerID={customerID} salonID={salonID} employeeID={employeeID}>
            <ThemeProvider>
                <Stack initialRouteName='index'>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
                    <Stack.Screen name="(stack)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </ThemeProvider>
        </SocketProvider>
    )
}

export default _layout