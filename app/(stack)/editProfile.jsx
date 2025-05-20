import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FocusableTextInput from '../../components/FocusableTextInput';

const EditProfile = () => {
    const [name, setName] = useState('');
    return (
        <SafeAreaView style={{ marginHorizontal: 10, height: '100%' }}>
            <View style={Style.headings}>
                <Text style={Style.title}>Edit</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>
                <Text style={[Style.subTitle]}>User Profile</Text>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Name</Text>
                    <FocusableTextInput placeholder="Enter your name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Email</Text>
                    <FocusableTextInput placeholder="Enter your email"
                    />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Phone Number</Text>
                    <FocusableTextInput placeholder="Enter your phone number"
                    />
                </View>
                <View style={Style.inputContainer}>
                    <Text style={Style.label}>Location</Text>
                    <FocusableTextInput placeholder="Enter your location"
                    />
                </View>

                <View style={Style.passowrdContainer}>
                    <Text style={{ fontSize: 23, marginBottom: 10, fontWeight: '500' }}>Change Password</Text>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Current Password</Text>
                        <FocusableTextInput placeholder="Enter your current password"
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>New Password</Text>
                        <FocusableTextInput placeholder="Enter your new password"
                        />
                    </View>
                    <View style={Style.inputContainer}>
                        <Text style={Style.label}>Confirm New Password</Text>
                        <FocusableTextInput placeholder="Confirm your new password"
                        />
                    </View>
                </View>
                <TouchableOpacity style={[Style.button, { padding: 5 }]}>
                    <Text style={Style.btnText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
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
        marginTop: 20,
        marginBottom: 20,
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