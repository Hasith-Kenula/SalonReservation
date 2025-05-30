import TabBar from '@/components/TabBar'
import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen name='home' options={{
                title: 'Home',
                headerShown: false,
            }} />
            <Tabs.Screen
                name='reservation'
                options={{
                    title: 'My Reservation',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}

export default _layout