import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack initialRouteName='_splash'>
            <Stack.Screen name="_splash" options={{ headerShown: false }} />
            <Stack.Screen name="(stack)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}

export default _layout