import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';

const _layout = () => {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="salonHome"
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="setting"
                options={{
                    title: 'Settings',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="detail"
                options={{
                    title: 'Detail',
                    headerShown: false,
                }}
            />


        </Tabs>
    )
}
export default _layout