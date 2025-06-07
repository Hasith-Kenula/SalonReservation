import StatusBox from '@/components/StatusBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

type SalonOpeningHours = {
    id: string;
    salonID: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
};
const COLOR = {
    closed: '#e74c3c',
    opening: '#3586DB',
}
const ManageOpeningHours = () => {
    const [openingHours, setOpeningHours] = useState<SalonOpeningHours[]>([]);
    const [salonID, setSalonID] = useState<string>();
    const [saveLoader, setSaveLoader] = useState<{ [key: string]: boolean }>({});
    const [contentLoader, setContentLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [statusBox, setStatusBox] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    // Track which picker is shown: { index: number, type: 'open' | 'close' } or null
    const [showTimePicker, setShowTimePicker] = useState<{ index: number; type: 'open' | 'close' } | null>(null);

    const fetchOpeningHours = async (isRefresh = false) => {
        try {
            if (!isRefresh) setContentLoader(true);
            else setRefreshing(true);
            const salon = await AsyncStorage.getItem('user');
            const salonData = JSON.parse(salon!);
            const salonID = salonData.salonID;
            if (!salonID) {
                alert('Salon ID not found in AsyncStorage.');
                return;
            }
            setSalonID(salonID);
            const response = await fetch(`http://192.168.1.2:3000/salon_opening_hours/${salonID}`);
            const result = await response.json();
            if (result.success) {
                // Convert open_time and close_time strings to ISO strings or Date objects if needed
                setOpeningHours(result.data);
            } else {
                alert('Failed to fetch opening hours.');
                setStatusBox({
                    message: 'Failed to fetch data.',
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error fetching opening hours:', error);
            setStatusBox({
                message: 'Unexpected error occurs.',
                type: 'warning',
            });
        } finally {
            if (!isRefresh) setContentLoader(false);
            else setRefreshing(false);
        }
    };
    useEffect(() => {
        fetchOpeningHours();
    }, []);

    const showOpeningTimePicker = (index: number) => {
        setShowTimePicker({ index, type: 'open' });
    };

    const showClosingTimePicker = (index: number) => {
        setShowTimePicker({ index, type: 'close' });
    };

    const parseTimeStringToDate = (timeString: string) => {
        if (!timeString) return new Date();
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
        return date;
    };
    const handleSave = async (openHour: SalonOpeningHours) => {
        try {
            setSaveLoader((prev) => ({ ...prev, [openHour.id]: true }));
            console.log(openHour);
            const response = await fetch(`http://192.168.1.2:3000/salon_opening_hours/${salonID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    openHour: openHour,
                }),
            });
            const result = await response.json();
            if (result.success) {
                setStatusBox({
                    message: result.message || 'Saved successfully.',
                    type: 'success',
                });
            } else {
                setStatusBox({
                    message: result.message || 'Failed to save.',
                    type: 'error',
                });
            }

        } catch (error) {
            console.error('Error updating opening hours:', error);
            setStatusBox({
                message: 'Unexpected error occurs',
                type: 'warning',
            });
        }
        finally {
            setSaveLoader((prev) => ({ ...prev, [openHour.id]: false }));
        };
    }

    return (
        <SafeAreaView style={styles.container} edges={['left', 'top', 'right']}>
            {statusBox && (
                <StatusBox message={statusBox.message} type={statusBox.type} onHide={() => setStatusBox(null)} />
            )}
            <View style={styles.headings}>
                <Text style={styles.title}>Manage Opening Hours</Text>
            </View>
            {contentLoader && (
                <ActivityIndicator size="large" color={COLOR.opening} />
            )}
            <ScrollView
                style={{ paddingHorizontal: 10 }}
                contentContainerStyle={{ paddingVertical: 10 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchOpeningHours(true)} />
                }
            >
                {openingHours.map((openHour: SalonOpeningHours, index: number) => {
                    return (
                        <View key={openHour.id} style={[styles.card, { borderBottomColor: openHour.is_closed ? COLOR.closed : COLOR.opening }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{openHour.day_of_week}</Text>
                                    <Text style={{ fontWeight: 600, color: openHour.is_closed ? COLOR.closed : COLOR.opening }}>{openHour.is_closed ? "Closed" : "Opening"}</Text>
                                </View>
                                <View>
                                    <Switch
                                        trackColor={{ false: COLOR.closed, true: COLOR.opening }}
                                        // thumbColor={openHour.is_closed ? COLOR.closed : COLOR.opening}
                                        ios_backgroundColor={openHour.is_closed ? COLOR.closed : COLOR.opening}
                                        value={Boolean(!openHour.is_closed)}
                                        onValueChange={(value) => { setOpeningHours((prev) => { return [...prev.map((item) => item.id === openHour.id ? { ...item, is_closed: !value } : item)] }); }}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                                paddingHorizontal: 10,
                                paddingVertical: 10
                            }}>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={[styles.label,]}>Open Time</Text>
                                    <DateTimePicker
                                        mode="time"
                                        display="default"
                                        value={parseTimeStringToDate(openHour.open_time || '00:00:00')}
                                        maximumDate={parseTimeStringToDate(openHour.close_time || '23:59:59')}
                                        onChange={(event, time) => {
                                            if (!time) return;
                                            const selectedTime = time.toTimeString().slice(0, 5);
                                            setOpeningHours((prev) => {
                                                return [...prev.map((item) => item.id === openHour.id ? { ...item, open_time: selectedTime } : item)];
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={[styles.label,]}>Close Time</Text>

                                    <DateTimePicker
                                        mode="time"
                                        display="default"
                                        value={parseTimeStringToDate(openHour.close_time || '00:00:00')}
                                        minimumDate={parseTimeStringToDate(openHour.open_time || '00:00:00')}
                                        onChange={(event, time) => {
                                            if (!time) return;
                                            const selectedTime = time.toTimeString().slice(0, 5);
                                            setOpeningHours((prev) => {
                                                return [...prev.map((item) => item.id === openHour.id ? { ...item, close_time: selectedTime } : item)];
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            {saveLoader[openHour.id] ? (
                                <TouchableOpacity style={styles.saveBtn}>
                                    <ActivityIndicator size={'small'} color={'white'} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(openHour)}>
                                    <Text style={styles.saveText}>Save</Text>
                                </TouchableOpacity>

                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f0f4f8', // softer background color for better contrast
        // backgroundColor: '#ffffff',
        backgroundColor: '#f9f9f9',
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
        alignContent: 'center',
        borderBottomColor: "rgba(131, 131, 131, 0.51)",
        borderBottomWidth: 1
    },
    card: {
        // backgroundColor: '#ffffff',
        // backgroundColor: '#f0f4f8',
        backgroundColor: '#E1EAFF',
        borderRadius: 12,
        marginBottom: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    label: {
        fontWeight: '600',
        fontSize: 14,
        color: '#34495e',
        marginBottom: 6,
    },
    saveBtn: {
        // backgroundColor: '#2980b9',
        backgroundColor: '#3586DB',
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 15,
        // shadowColor: '#2980b9',
        shadowColor: '#3586DB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    saveText: {
        color: '#ecf0f1',
        fontSize: 18,
        fontWeight: '700',
    },
    timeButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 6,
        marginTop: 6,
        minWidth: 130,
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
    },
});


export default ManageOpeningHours;
