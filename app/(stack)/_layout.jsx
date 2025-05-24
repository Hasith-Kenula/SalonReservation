import { Stack } from 'expo-router'

const _layout = () => {
    return (
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
        </Stack>
    )
}

export default _layout