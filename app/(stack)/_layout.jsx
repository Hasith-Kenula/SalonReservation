import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

const _layout = () => {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const url = event.url;
            if (url.includes('salon-detail')) {
                router.replace('/salonDetail'); // Adjust this to your actual screen path if needed
            }
        };

        const setupLinking = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl && initialUrl.includes('salon-detail')) {
                router.replace('/salonDetail');
            }
        };

        Linking.addEventListener('url', handleDeepLink);
        setupLinking();

        return () => {
            Linking.removeAllListeners('url');
        };
    }, []);
    return (
        <StripeProvider
            publishableKey='pk_test_51ReFpHHK0mOzH3eWINAHHUHzgPK4q9fk7GjLUes7e9YrgRIzjva30wBXoyjWAm9FSUCbqv8u32oC4uNdn0q5M4rh00BmN9uPYP'
            urlScheme='saloonreservation'
            merchantIdentifier='merchant.com.infinity.saloonreservation'
        >

            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="registration" options={{ headerShown: false }} />
                <Stack.Screen name="salonBrowser" options={{ headerShown: false }} />
                <Stack.Screen name="salonDetail" options={{ headerShown: false }} />
                <Stack.Screen name='serviceManagement' options={{ headerShown: false }} />
                <Stack.Screen name='staffManagement' options={{ headerShown: false }} />
                <Stack.Screen name="editProfile" options={{
                    headerShown: false,
                    title: 'Edit Profile',
                    headerTitleAlign: 'left',
                    headerTintColor: '#3586DB',
                    headerStyle: {
                        backgroundColor: '#f9f9f9',
                    },
                }} />
                <Stack.Screen name='manageOpeningHours' options={{ headerShown: false }} />
            </Stack>
        </StripeProvider>
    )
}

export default _layout