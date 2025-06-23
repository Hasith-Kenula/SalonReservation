
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useState } from 'react';
type User = {

}
const Profile = () => {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState({
    id: 'Unknown',
    name: 'Unknown',
    address: "Unknown",
    phone: 'Unknown',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe',
    ownerName: 'Unknown'
  });
  const [role, setRole] = useState('Unknown');
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        console.log("fetching...");
        const userJson = await AsyncStorage.getItem('user');
        const _role = await AsyncStorage.getItem('role');
        if (userJson && _role) {
          try {
            const parsedUser = JSON.parse(userJson);
            setRole(_role);
            setUser({
              id: parsedUser.customerID || parsedUser.salonID || 'Unknown',
              name: parsedUser.fullName || parsedUser.salonName || 'Unknown',
              address: parsedUser.address || 'Unknown',
              phone: parsedUser.phone || 'Unknown',
              avatar: parsedUser.avatar || 'https://ui-avatars.com/api/?name=Jane+Doe',
              ownerName: parsedUser.ownerName || 'Unknown',

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
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: theme.colors.tonal_a0 }}>
      <View style={styles.headings}>
        <Text style={[styles.title, { color: theme.colors.textColor }]}>Profile</Text>
      </View>
      <View style={styles.container}>
        <View style={[styles.profileSection, { backgroundColor: theme.colors.tonal_a0, shadowColor: isDark ? '#ffffff' : '#000000' }]}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={[styles.userName, { color: theme.colors.primary_a30 }]}>{user.name}</Text>
          <View style={[styles.infoBox, { backgroundColor: theme.colors.tonal_a10 }]}>
            <Text style={[styles.label, { color: theme.colors.primary_a50 }]}>{role} ID</Text>
            <Text style={[styles.value, { color: theme.colors.textColor }]}>{user.id}</Text>
          </View>
          {role == 'Salon' &&
            (
              <View style={[styles.infoBox, { backgroundColor: theme.colors.tonal_a10 }]}>
                <Text style={[styles.label, { color: theme.colors.primary_a50 }]}>Owner Name</Text>
                <Text style={[styles.value, { color: theme.colors.textColor }]}>{user.ownerName}</Text>
              </View>
            )}
          <View style={[styles.infoBox, { backgroundColor: theme.colors.tonal_a10 }]}>
            <Text style={[styles.label, { color: theme.colors.primary_a50 }]}>Address</Text>
            <Text style={[styles.value, { color: theme.colors.textColor }]}>{user.address}</Text>
          </View>
          <View style={[styles.infoBox, { backgroundColor: theme.colors.tonal_a10 }]}>
            <Text style={[styles.label, { color: theme.colors.primary_a50 }]}>Phone</Text>
            <Text style={[styles.value, { color: theme.colors.textColor }]}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#3586DB' }]}
            onPress={() => router.push('/editProfile')}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#e74c3c' }]}
            onPress={() => { handleLogout() }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    alignSelf: 'flex-start',
    marginLeft: 10,
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
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 16,
    padding: 24,
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
    marginTop: 10,
    flex: 1,
    flexDirection: 'column'
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