import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DropdownItem = {
    label: string;
    value: string;
};

const items: DropdownItem[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
];

const DropdownExample = () => {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<DropdownItem | null>(null);

    const toggleDropdown = () => {
        setVisible(!visible);
    };

    const onSelect = (item: DropdownItem) => {
        setSelected(item);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.selector} onPress={toggleDropdown}>
                <Text style={styles.selectedText}>
                    {selected ? selected.label : 'Select an option'}
                </Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={styles.dropdown}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => onSelect(item)}
                                >
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    selector: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    selectedText: {
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dropdown: {
        marginHorizontal: 40,
        backgroundColor: 'white',
        borderRadius: 6,
        maxHeight: 200,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
    },
});

export default DropdownExample;
