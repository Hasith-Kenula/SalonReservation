import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
type Service = {
    serviceID: string;
    salonID: string;
    serviceName: string;
    servicePrice: number;
    durationMinutes: number;
};

type ServiceProps = {
    service: Service;
    onEdit: (service: Service) => void;
    onDelete: (serviceID: string) => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceProps) => {
    const { theme } = useTheme();

    const STYLE = {
        background: theme.colors.tonal_a10,
        title: theme.colors.primary_a0,
        text: theme.colors.primary_a50,
    }
    return (
        <View style={[styles.serviceCard, { backgroundColor: STYLE.background }]}>
            <View style={{ flex: 1, }}>
                <Text style={[styles.serviceName, { color: STYLE.title, marginBottom: 5 }]}>{service.serviceName}</Text>
                <Text style={[styles.serviceDetail, { color: STYLE.text }]}>Price: LKR {Number(service.servicePrice)}</Text>
                <Text style={[styles.serviceDetail, { color: STYLE.text }]}>Duration: {service.durationMinutes} min</Text>
            </View>
            <TouchableOpacity onPress={() => onEdit(service)} style={styles.editBtn}>
                <Text style={{ color: '#3586DB', fontWeight: 'bold' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(service.serviceID)} style={styles.deleteBtn}>
                <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    serviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#fff', 
        backgroundColor: '#E1EAFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        elevation: 1
    },
    serviceName: { fontSize: 17, fontWeight: 'bold', color: '#3586DB' },
    serviceDetail: { fontSize: 14, color: '#555' },
    editBtn: { marginLeft: 10, padding: 6 },
    deleteBtn: { marginLeft: 6, padding: 6 },
})

export default ServiceCard