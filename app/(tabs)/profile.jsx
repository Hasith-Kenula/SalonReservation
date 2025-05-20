
import { useNavigation, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Profile = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe'
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
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
          onPress={() => router.push('/login')}
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
    paddingBottom: 80
  },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  email: { fontSize: 16, color: '#888', marginBottom: 10 },
  buttonSection: {
    marginTop: 30,
    justifyContent: 'flex-end',
    flex: 1,
  },
  button: {
    backgroundColor: '#3586DB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
export default Profile