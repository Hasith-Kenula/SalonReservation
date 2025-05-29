import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ConfirmationModalProps = {
    visible: boolean;
    message: ReactNode;
    title: string;
    onConfirm: () => void;
    onReject?: () => void;
    onClose: () => void;
    confirmText?: string;
    rejectText?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    message,
    title,
    onConfirm,
    onReject,
    onClose,
    confirmText = 'Confirm',
    rejectText = 'Reject',
}) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.message}>{message}</View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.buttons}>
                        {onReject && (
                            <TouchableOpacity
                                style={[styles.button, styles.rejectButton]}
                                onPress={() => {
                                    onReject();
                                    onClose();
                                }}
                            >
                                <Text style={styles.rejectText}>{rejectText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginBottom: 10,
    },
    title: {
        fontWeight: '600',
    },
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 30,
        borderRadius: 12,
        padding: 10,
        width: '80%',
        elevation: 5,
    },
    message: {
        fontSize: 16,
        marginBottom: 10,
        color: '#222',
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginLeft: 10,
    },
    confirmButton: {
        backgroundColor: '#3586DB',
    },
    rejectButton: {
        backgroundColor: '#e74c3c',
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    rejectText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ConfirmationModal;
