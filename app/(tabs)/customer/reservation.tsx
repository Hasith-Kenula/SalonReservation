import ConfirmationModal from '@/components/ConfirmationModal';
import StatusBox from '@/components/StatusBox';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../../socket/socketProvider';


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

type Reservations = {
  resID: string;
  resDate: string;
  resTime: string;
  resStatus: 'processing' | 'completed' | 'cancelled' | 'pending';
  salonName: string;
  salonPhone: string;
  reservedServices: string;
  totalPrice: string;
  message: string,
};

const STATUS_COLORS = {
  pending: '#FFC107',
  processing: '#2B6EC5',
  completed: '#27ae60',
  cancelled: '#e74c3c',

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
  const [customerID, setCustomerID] = useState<string | null>(null);
  const [requestExpired, setRequestExpired] = useState(false);

  const [statusBox, setStatusBox] = useState<{ message: string, type: 'warning' | 'success' | 'error' | 'info' } | null>(null);

  const [modelVisibility, setModelVisibility] = useState(false);
  const [modelMessage, setModelMessage] = useState("");
  const [confirmationData, setConfirmationData] = useState<{ resID: string, customerID: string, employeeID: string, employeeName: string, salonID: string, resStatus: string, message: string } | null>(null);

  const socket = useSocket();

  const openConfirmationModel = (data: typeof confirmationData) => {
    setConfirmationData(data);
    setModelMessage(data?.message || '');
    setModelVisibility(true);
  }
  const onConfirm = () => {
    if (confirmationData && socket) {
      socket.emit('reservation:confirmResponse', {
        ...confirmationData,
        confirmed: true,
      });
    }
    setModelVisibility(false);
  }
  //message reject handler
  const onReject = () => {
    if (confirmationData && socket) {
      socket.emit('reservation:confirmResponse', {
        ...confirmationData,
        confirmed: false,
      });
    }
    setModelVisibility(false);
  }
  useEffect(() => {
    const getCustomerID = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      setCustomerID(user?.customerID || null);
    };
    getCustomerID();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);

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
    if (!customerID) return;

    fetchReservations();


    // console.log("Connecting to socket with customerID:", customerID);
    // const socket = io('http://192.168.1.2:3000', {
    //   transports: ['websocket'],
    //   query: { customerID },
    // });
    // socket.on('reservation:statusUpdate', (updatedReservation: Reservations) => {
    //   console.log('Reservation status updated:', updatedReservation);
    //   setReservations(prev =>
    //     prev.map(res =>
    //       res.resID === updatedReservation.resID
    //         ? { ...res, ...updatedReservation }
    //         : res
    //     )
    //   );
    // });
    // return () => {
    //   socket.disconnect();
    // }
  }, [customerID]);
  useEffect(() => {
    if (!socket) {
      console.warn('Customer: Socket not initialized');
      return;
    };

    const handleConfirmRequest = (data: {
      resID: string;
      customerID: string;
      employeeID: string;
      salonID: string;
      employeeName: string;
      resStatus: string;
      message: string;
    }) => {
      // if (requestExpired) {
      //   return;
      // }
      openConfirmationModel(data);
      // Alert.alert('Reservation Confirmation', data.message, [
      //   {
      //     text: 'Reject',
      //     style: 'cancel',
      //     onPress: () => {
      // socket.emit('reservation:confirmResponse', {
      //   resID: data.resID,
      //   customerID: data.customerID,
      //   employeeID: data.employeeID,
      //   salonID: data.salonID,
      //   employeeName: data.employeeName,
      //   resStatus: data.resStatus,
      //   confirmed: false,
      // });
      //       console.log('Reject')
      //     }
      //   },
      //   {
      //     text: 'Confirm',
      //     style: 'default',
      //     onPress: () => {
      // socket.emit('reservation:confirmResponse', {
      //   resID: data.resID,
      //   customerID: data.customerID,
      //   employeeID: data.employeeID,
      //   salonID: data.salonID,
      //   employeeName: data.employeeName,
      //   resStatus: data.resStatus,
      //   confirmed: true,
      // });
      //       console.log('Confirm')
      //     }
      //   }

      // ]);
    }
    //message confirm handler


    const onRequestExpired = () => {
      setModelVisibility(false);
      setRequestExpired(true);

      setStatusBox({
        message: 'Request has expired.',
        type: 'warning',
      });

    }

    console.log("Connecting to socket with customerID:", customerID);

    socket.on('reservation:statusUpdate', (updatedReservation: Reservations) => {
      //alert('status updating');
      console.log('Reservation status updated:', updatedReservation);
      setReservations(prev =>
        prev.map(res =>
          res.resID === updatedReservation.resID
            ? { ...res, ...updatedReservation }
            : res
        )
      );
    });
    socket.on('reservation:confirmRequest', handleConfirmRequest);
    socket.on('reservation:requestExpired', onRequestExpired);

    return () => {
      socket.off('reservation:statusUpdate');
      socket.off('reservation:confirmRequest', handleConfirmRequest);
      socket.off('reservation:requestExpired', onRequestExpired);

    }
  }, [socket, requestExpired]);

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

  const renderStatusBadge = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    return (
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[status] }]}>
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
    <SafeAreaView style={[styles.container,]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      {statusBox && (
        <StatusBox message={statusBox.message} type={statusBox.type} onHide={() => setStatusBox(null)} />
      )}
      <View style={styles.headings}>
        <Text style={styles.title}>My Reservations</Text>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 20 }}
        style={{ paddingHorizontal: 15, }}
        data={reservations}
        keyExtractor={item => item.resID}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: STATUS_COLORS[item.resStatus], shadowColor: STATUS_COLORS[item.resStatus] }]}>
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
      <ConfirmationModal visible={modelVisibility} title={confirmationData?.message || 'Unknown'} message={
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.bold}>Reservation ID: </Text>
            <Text>{confirmationData?.resID}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.bold}>Employee Name: </Text>
            <Text>{confirmationData?.employeeName}</Text>
          </View>
        </>
      }
        onConfirm={onConfirm}
        onReject={onReject}
        onClose={() => { setModelVisibility(false) }}
        confirmText='Confirm'
        rejectText='Reject'
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    borderLeftWidth: 5,
    // borderLeftColor: THEME_COLOR,
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