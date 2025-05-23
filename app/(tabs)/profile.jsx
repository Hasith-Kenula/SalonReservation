
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import React, { useState } from 'react';

const Profile = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [user, setUser] = useState({
    id: 'Unknown',
    name: 'Unknown',
    address: "Unknown",
    phone: 'Unknown',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe'
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        console.log("fetching...");
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          try {
            const parsedUser = JSON.parse(userJson);
            setUser({
              id: parsedUser.customerID,
              name: parsedUser.fullName || 'Unknown',
              address: parsedUser.address,
              phone: parsedUser.phone || 'Unknown',
              avatar: parsedUser.avatar || 'https://ui-avatars.com/api/?name=Jane+Doe'
            });
          } catch (e) {
            // fallback to default user
          }
        }
      };
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('role');
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.value}>{user.id}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{user.address}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={[styles.button, { backgroundColor: '#3586DB' }]}
          onPress={() => router.push('/editProfile')}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: '#e74c3c' }]}
          onPress={() => { handleLogout() }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    paddingBottom: 80,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3586DB',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3586DB',
    marginBottom: 18,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f1f6fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
  },
  buttonSection: {
    marginTop: 30,
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#3586DB',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
export default Profile