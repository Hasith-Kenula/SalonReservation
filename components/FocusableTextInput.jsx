import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const FocusableTextInput = (props) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[Style.inputWrapper, isFocused && Style.inputWrapperFocused]}>
            <TextInput
                {...props}
                placeholderTextColor="gray"
                style={Style.input}
                onFocus={(e) => {
                    setIsFocused(true);
                    console.log('onFocus');
                    if (props.onFocus) {
                        props.onFocus(e);
                    }
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    console.log('onBlur');
                    if (props.onBlur) {
                        props.onBlur(e);
                    }
                }}
            />
        </View >
    )
}
const Style = StyleSheet.create({
    inputWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        shadowColor: '#3586DB',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 3.84,
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
    input: {
        backgroundColor: 'transparent',
        padding: 10,
        height: 50,
    },
})
export default FocusableTextInput