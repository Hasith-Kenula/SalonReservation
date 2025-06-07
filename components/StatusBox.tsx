import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useEffect, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

type StatusBoxProps = {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number; // in milliseconds
    onHide?: () => void;
};

const STATUS_COLORS = {
    success: '#27ae60',
    error: '#FF3333',
    info: '#3586DB',
    warning: '#FFB900',
    // warning: '#ffcc00',
};

const ICON_SIZE: number = 24;
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
    const translateY = React.useRef(new Animated.Value(0)).current;
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Fade in and slide down from above
        translateY.setValue(-50);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto fade out and slide up after duration
        timerRef.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -50,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setVisible(false);
                if (onHide) onHide();
            });
        }, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [fadeAnim, duration, onHide, translateY]);

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only respond to vertical swipes
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy < 0) {
                    // Move up only
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -50) {
                    // If swipe up distance is more than 50, dismiss the box
                    if (timerRef.current) clearTimeout(timerRef.current);
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: -100,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        setVisible(false);
                        if (onHide) onHide();
                    });
                } else {
                    // Otherwise, reset position
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    backgroundColor: 'white',
                    borderColor: STATUS_COLORS[type],
                    opacity: fadeAnim,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ translateY }],
                },
            ]}
        >
            <View style={{ marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
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
            </View>
            <Text style={[styles.message, { color: STATUS_COLORS[type], flex: 1, textAlign: 'center' }]}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
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
        alignSelf: 'center',
        fontSize: 16,
        textAlign: 'center',
        alignItems: 'center'
    },
});

export default StatusBox;
