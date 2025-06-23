import React, { ReactElement, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface FocusableTextInputProps extends TextInputProps {
    Icon?: ReactElement | null;
    color?: string;
    IconPosition?: 'left' | 'right' | null;
}

import { StyleProp, ViewStyle } from 'react-native';

const FocusableTextInput = ({ Icon = null, IconPosition = 'right', color = 'black', style, ...props }: FocusableTextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[Style.inputWrapper, isFocused && Style.inputWrapperFocused, Icon && Style.inputWrapperWithIcon, style as StyleProp<ViewStyle>, { paddingLeft: IconPosition == 'left' ? 40 : 0, paddingRight: IconPosition == 'left' ? 0 : 40 }]}>
            <TextInput
                {...props}

                style={[Style.input, Icon && Style.inputWithIcon, color && { color: color }]}
                onFocus={(e) => {
                    setIsFocused(true);
                    if (props.onFocus) {
                        props.onFocus(e);
                    }
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    if (props.onBlur) {
                        props.onBlur(e);
                    }
                }}
            />
            {Icon && <View style={[Style.iconContainer, { left: IconPosition == 'left' ? 10 : 0 }]}>{Icon}</View>}
        </View>
    );
};

const Style = StyleSheet.create({
    inputWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        shadowColor: '#3586DB',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 3.84,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    inputWrapperFocused: {
        borderColor: '#3586DB',
        shadowColor: '#3586DB',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputWrapperWithIcon: {
        paddingRight: 40, // space for the icon
    },
    input: {
        backgroundColor: 'transparent',
        padding: 10,
        height: 50,
        flex: 1,
    },
    inputWithIcon: {
        paddingRight: 10,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
});

export default FocusableTextInput;
