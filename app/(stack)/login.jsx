import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import user from '../../Data/user';
import FocusableTextInput from '../../components/FocusableTextInput';

function Login() {

    const AppName = 'Salon App';

    const navigation: any = useNavigation();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={Style.mainContainer}>
            <View style={[Style.title]}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3586DB' }}>Welcome to {AppName}</Text>
            </View>
            <View style={Style.formContainer}>
                <View style={Style.inputContainer}>
                    <Text>Username</Text>
                    <FocusableTextInput placeholder="Enter your username"
                        placeholderTextColor="gray"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        style={Style.input} />
                </View>
                <View style={Style.inputContainer}>
                    <Text>Password</Text>
                    <FocusableTextInput placeholder="Enter your password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={Style.input} />
                </View>
                <TouchableOpacity style={Style.button} onPress={() => {
                    if (username && password) {
                        const userData = user.find((user) => user.name === username && user.password === password);
                        if (userData) {
                            router.push({
                                pathname: '/',
                                params: {
                                    name: userData.name,
                                    email: userData.email,
                                    phone: userData.phone,
                                    location: userData.location,
                                }
                            }
                            );
                        } else {
                            alert('Invalid username or password');
                        }
                    }
                }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
                </TouchableOpacity>
                <View>
                    <Text style={{ paddingTop: 10 }}>Don't have an account?{' '}
                        <Pressable onPress={() => {
                            router.push('/registration');
                        }}>
                            <Text style={{ color: '#3586DB', fontWeight: 'bold', }}> Register</Text>
                        </Pressable>
                    </Text>
                </View>
                <View>
                    <Text>Forgot Password?</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
const Style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
    },
    title: {
        flex: 5,
        justifyContent: 'center',
        marginTop: 70,
        alignItems: 'center',
    },
    formContainer: {
        flex: 25,
        justifyContent: 'center',
    },
    inputContainer: {

        marginBottom: 10,
        padding: 5,
    },
    passwordContainer: {

        flexDirection: 'row',
    },
    visibleIcon: {
        position: 'absolute',
        alignSelf: 'center',
        right: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    button: {

        height: 50,
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#3586DB',
        borderRadius: 5,
    },
});
export default Login