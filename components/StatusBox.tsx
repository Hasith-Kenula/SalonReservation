import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type StatusBoxProps = {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number; // in milliseconds
    onHide?: () => void;
};

const STATUS_COLORS = {
    success: '#4BB543',
    error: '#FF3333',
    info: '#3586DB',
};

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
        <Animated.View style={[styles.container, { backgroundColor: STATUS_COLORS[type], opacity: fadeAnim }]}>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        paddingVertical: 12,
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
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default StatusBox;
