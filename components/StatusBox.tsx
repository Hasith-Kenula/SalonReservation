import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
type StatusBoxProps = {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number; // in milliseconds
    onHide?: () => void;
};

const STATUS_COLORS = {
    success: '#4BB543',
    error: '#FF3333',
    info: '#3586DB',
    warning: '#ffcc00',
};

const ICON_SIZE: number = 20;
const errorIcon = (color: string) => {
    return (
        <FontAwesome6 name="times-circle" size={ICON_SIZE} color={color} />
    );
}
const doneIcon = (color: string) => {
    return (
        <FontAwesome6 name="check-circle" size={ICON_SIZE} color={color} />
    );
}
const infoIcon = (color: string) => {
    return (
        <Octicons name="info" size={ICON_SIZE} color={color} />
    );
}
const warnIcon = (color: string) => {
    return (
        <Ionicons name="warning-outline" size={ICON_SIZE} color={color} />
    );
}
const StatusBox = ({ message, type = 'info', duration = 5000, onHide }: StatusBoxProps) => {
    const [visible, setVisible] = useState(true);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto fade out after duration
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
                if (onHide) onHide();
            });
        }, duration);

        return () => clearTimeout(timer);
    }, [fadeAnim, duration, onHide]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { backgroundColor: 'white', borderColor: STATUS_COLORS[type], opacity: fadeAnim }]}>
            <Text style={[styles.message, { color: STATUS_COLORS[type], marginRight: 10 }]}>{message}</Text>
            {type === 'success' && (
                doneIcon(STATUS_COLORS[type])
            )}
            {type === 'error' && (
                errorIcon(STATUS_COLORS[type])
            )}
            {type === 'info' && (
                infoIcon(STATUS_COLORS[type])
            )}
            {type === 'warning' && (
                warnIcon(STATUS_COLORS[type])
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        top: 50,
        left: 20,
        right: 20,
        borderWidth: 0,
        paddingVertical: 12,
        borderLeftWidth: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        zIndex: 1000,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    message: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default StatusBox;

