import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack initialRouteName='index'>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(stack)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}

export default _layout