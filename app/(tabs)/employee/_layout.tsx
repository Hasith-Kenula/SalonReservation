import { Tabs } from 'expo-router'
import React from 'react'
import TabBar from '../../../components/TabBar'

const _layout = () => {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen name='employeeHome'
                options={{
                    title: 'Home',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    headerShown: false,
                }} />
        </Tabs>
    )
}

export default _layout