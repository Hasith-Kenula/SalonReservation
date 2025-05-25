import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Reservations = {
  resID: string;
  resDate: string;
  resTime: string;
  resStatus: string;
  salonName: string;
  salonPhone: string;
  reservedServices: string;
  totalPrice: string;
};

const THEME_COLOR = '#3586DB';
const PhoneIcon = () => {
  return (
    <Ionicons name="call" size={17} color={THEME_COLOR} />
  );
}

const ReservationScreen = () => {
  console.log("Reservation Screen");
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    const userJson = await AsyncStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const customerID = user?.customerID;
    if (!customerID) {
      setReservations([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://192.168.1.2:3000/reservations/customer/${customerID}`);
      const data = await res.json();
      setReservations(data.data);
    } catch (e) {
      setReservations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = (resID: string) => {
    Alert.alert(
      'Delete Reservation',
      'Are you sure you want to delete this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.2:3000/reservations/${resID}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const result = await response.json();
              if (result.success) {
                setReservations(reservations.filter(r => r.resID !== resID));
                Alert.alert('Success', 'Reservation deleted successfully');
              } else {
                Alert.alert('Error', result.message);
              }


            } catch {
              Alert.alert('Error', 'Something went wrong.');
            }
          }
        }
      ]
    );
  };

  const handleCancel = (resID: string) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes', style: 'destructive', onPress: async () => {
            try {
              await fetch(`http://192.168.1.2:3000/reservations/${resID}/cancel`, { method: 'PUT' });
              fetchReservations();
            } catch {
              Alert.alert('Error', 'Failed to cancel reservation.');
            }
          }
        }
      ]
    );
  };

  const renderStatusBadge = (status: string) => {
    let color = '#bbb';
    if (status === 'pending') color = '#f1c40f';
    else if (status === 'processing') color = '#2B6EC5';
    else if (status === 'completed') color = '#27ae60';
    else if (status === 'cancelled') color = '#e74c3c';
    return (
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Text style={styles.statusBadgeText}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headings}>
        <Text style={styles.title}>My Reservations</Text>
      </View>
      <FlatList
        style={{ paddingHorizontal: 15, paddingTop: 20, }}
        data={reservations}
        keyExtractor={item => item.resID}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {renderStatusBadge(item.resStatus)}
              <Text style={styles.resID}>#{item.resID}</Text>
            </View>
            <Text style={styles.salonName}>{item.salonName || 'Unknown'}</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'center' }} onPress={() => { Linking.openURL(`tel:${item.salonPhone}`) }}>
              {PhoneIcon()}
              <Text style={styles.salonPhone}> {item.salonPhone || 'Unknown'}</Text>
            </TouchableOpacity>
            <Text style={styles.detail}>Date: <Text style={styles.bold}>{item.resDate}</Text></Text>
            <Text style={styles.detail}>Time: <Text style={styles.bold}>{item.resTime}</Text></Text>
            <Text style={styles.detail}>Services: <Text style={styles.bold}>{item.reservedServices || 'Unknown'}</Text></Text>
            <Text style={styles.detail}>Total: <Text style={styles.price}>LKR {item.totalPrice || 'Unknown'}</Text></Text>
            <View style={styles.actions}>
              {(item.resStatus === 'pending' || item.resStatus === 'processing') && (
                <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.resID)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              )}
              {item.resStatus === 'pending' && (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.resID)}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              )}

            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No reservations found.</Text>}
        refreshing={loading}
        onRefresh={fetchReservations}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginBottom: 80 },
  title: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 30,
    color: THEME_COLOR,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  headings: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(131, 131, 131, 0.51)',
    borderBottomWidth: 1,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 18,
    borderRadius: 12,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR,
  },
  cardHeader: {
    flexDirection: 'column',
    marginBottom: 6,
  },
  resID: {
    fontWeight: 'bold',
    color: THEME_COLOR,
    fontSize: 16,
  },
  salonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLOR,
    marginBottom: 2,
  },
  salonPhone: {
    textDecorationLine: 'underline', color: THEME_COLOR,
    fontSize: 15,
    // color: '#555',
    marginBottom: 6,
  },
  detail: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  price: {
    color: THEME_COLOR,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderColor: THEME_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelBtnText: {
    color: THEME_COLOR,
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ReservationScreen;