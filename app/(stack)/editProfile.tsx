import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusableTextInput from '../../components/FocusableTextInput';

const EditProfile = () => {

    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [salonID, setSalonID] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const { theme, isDark } = useTheme();

    const [locationLoader, setLocationLoader] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userJson = await AsyncStorage.getItem('user');
            const _role = await AsyncStorage.getItem('role');
            if (userJson && _role) {
                try {
                    const user = JSON.parse(userJson);

                    setUser(user);

                    setPhone(user.phone);
                    setAddress(user.address);
                    setLatitude(user.latitude ? user.latitude.toString() : '');
                    setLongitude(user.longitude ? user.longitude.toString() : '');
                    setRole(_role)

                    if (_role == 'Customer') {
                        setCustomerID(user.customerID)
                        setName(user.fullName);
                    } else {
                        setSalonID(user.salonID);
                        setName(user.salonName);
                        setOwnerName(user.ownerName);
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchUser();
    }, []);

    const handleSave = async () => {
        console.log("click Save");
        try {
            let updatedUser;
            let apiUrl = '';
            let payload = {};
            if (role == 'Customer') {
                updatedUser = {
                    ...user,
                    fullName: name,
                    phone: phone,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                }
                apiUrl = `http://192.168.1.2:3000/customers/update/${customerID}`;
                payload = {
                    fullName: name,
                    phone: phone,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                };


            } else {
                updatedUser = {
                    ...user,
                    salonName: name,
                    ownerName: ownerName,
                    phone: phone,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                }
                apiUrl = `http://192.168.1.2:3000/salons/update/${salonID}`
                payload = {
                    salonName: name,
                    ownerName: ownerName,
                    phone: phone,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                }



            }
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.success) {
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                alert(result.message);
            } else {
                alert('Failed to update profile');
                console.log(`URL: ${apiUrl} \n Payload: ${JSON.stringify(payload)} \n Response: ${JSON.stringify(result)}`);
            }


        } catch (error) {
            console.log(error)
        }
    }
    // Get current location
    const getGeoLocation = async () => {
        setLocationLoader(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
            console.log(`Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
        } catch (error) {
            console.error('Error getting location:', error);
            alert('Error getting location');
        } finally {
            setLocationLoader(false);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled>
            <SafeAreaView style={{ height: '100%', backgroundColor: theme.colors.tonal_a0 }} edges={['left', 'top', 'right']}>
                <View style={Style.headings}>
                    <Text style={[Style.title, { color: theme.colors.textColor }]}>Edit</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    keyboardShouldPersistTaps='handled'>
                    <Text style={[Style.subTitle, { color: theme.colors.textColor }]}>{role == 'Customer' ? 'User' : 'Salon'} Profile</Text>
                    <View style={Style.inputContainer}>
                        <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>{role == 'Customer' ? 'Full' : 'Salon'} Name</Text>
                        <FocusableTextInput placeholder="Enter your name"
                            placeholderTextColor={theme.colors.tonal_a50}
                            value={name}
                            color={theme.colors.textColor}
                            style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    {/* <View style={Style.inputContainer}>
                    <Text style={Style.label}>Email</Text>
                    <FocusableTextInput placeholder="Enter your email"
                        value
                        onChangeText={(text) => { }}
                    />
                </View> */}
                    {role == 'Salon' && (
                        <View style={Style.inputContainer}>
                            <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>Owner Name</Text>
                            <FocusableTextInput placeholder="Owner Name"
                                placeholderTextColor={theme.colors.tonal_a50}

                                value={ownerName}
                                color={theme.colors.textColor}
                                style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }}
                                onChangeText={(text) => { setOwnerName(text) }}
                            />
                        </View>
                    )}
                    <View style={Style.inputContainer}>
                        <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>Phone Number</Text>
                        <FocusableTextInput
                            placeholder="Enter phone number"
                            placeholderTextColor={theme.colors.tonal_a50}

                            value={phone}
                            color={theme.colors.textColor}
                            style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }}
                            onChangeText={(text) => { setPhone(text) }}
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>Address</Text>
                        <FocusableTextInput placeholder="Enter your location"
                            placeholderTextColor={theme.colors.tonal_a50}
                            value={address} color={theme.colors.textColor}
                            style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }} onChangeText={(text) => { setAddress(text) }}
                        />
                    </View>
                    {role !== 'employee' && (
                        <View style={Style.inputContainer}>
                            <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>Location</Text>
                            <View style={{ flexDirection: 'row', columnGap: 10 }}>
                                <FocusableTextInput placeholder="latitude"
                                    editable={false}
                                    placeholderTextColor={theme.colors.tonal_a50}
                                    value={latitude} color={theme.colors.textColor}
                                    style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10, flexGrow: 1 }} onChangeText={(text) => { setLatitude(text) }}
                                />
                                <FocusableTextInput placeholder="longitude"
                                    editable={false}
                                    placeholderTextColor={theme.colors.tonal_a50}
                                    value={longitude}
                                    color={theme.colors.textColor}
                                    Icon={null}
                                    style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10, flexGrow: 1, }} onChangeText={(text) => { setLongitude(text) }}
                                />
                                <TouchableOpacity style={[Style.button, { padding: 5, width: 100 }]} onPress={() => { getGeoLocation() }} disabled={locationLoader}>
                                    {locationLoader ? (
                                        <ActivityIndicator size="small" color={'white'} />
                                    ) : (
                                        <Text style={Style.btnText}>Get Location</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={Style.passowrdContainer}>
                        <Text style={{ fontSize: 23, marginBottom: 10, fontWeight: '500', color: theme.colors.textColor }}>Change Password</Text>
                        <View style={Style.inputContainer}>
                            <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>Current Password</Text>
                            <FocusableTextInput placeholder="Enter your current password"
                                placeholderTextColor={theme.colors.tonal_a50}
                                color={theme.colors.textColor}
                                style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }}
                            />
                        </View>
                        <View style={Style.inputContainer}>
                            <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>New Password</Text>
                            <FocusableTextInput placeholder="Enter your new password"
                                placeholderTextColor={theme.colors.tonal_a50}
                                color={theme.colors.textColor}
                                style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }}
                            />
                        </View>
                        <View style={Style.inputContainer}>
                            <Text style={[Style.label, { color: theme.colors.primary_a50 }]}>Confirm New Password</Text>
                            <FocusableTextInput placeholder="Confirm your new password"
                                placeholderTextColor={theme.colors.tonal_a50}
                                color={theme.colors.textColor}
                                style={{ backgroundColor: theme.colors.tonal_a10, borderColor: theme.colors.tonal_a10 }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={[Style.button, { padding: 5 }]} onPress={() => { handleSave() }}>
                        <Text style={Style.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

        </KeyboardAvoidingView>
    )
}
const Style = StyleSheet.create({
    title: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
    },
    subTitle: {
        alignSelf: 'center',
        fontSize: 30,
        paddingBottom: 10,
        //color: '#3586DB',
        fontWeight: 'bold',
    },
    headings: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(131, 131, 131, 0.51)',
        borderBottomWidth: 1,
    },
    inputContainer: {
        marginBottom: 10,
        padding: 5,
    },
    input: {
        backgroundColor: 'transparent',
        padding: 10,
        height: 50,
    },
    label: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold',

    },
    button: {
        backgroundColor: '#3586DB',
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    passowrdContainer: {
        flexDirection: 'column',
        marginTop: 20,
        padding: 5,
        borderTopColor: 'gray',
        borderTopWidth: 1,
    },


})
export default EditProfile