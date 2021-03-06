import React, {useReducer} from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'

const INPUT_CHANGE = 'INPUT_CHANGE'
const inputReducer = ( state, action ) => {
    switch(action.type){
        case INPUT_CHANGE : {
            const updatedState = {
                ...state,
                value : action.value,
                isValid : action.isValid
            }
        }
        default : return state
    }
}
const Input = (props) => {

    const initialState = {
        value : props.value ? props.value : '',
        isValid : props.isValid && props.isValid,
        touched : false
    }
    const [ inputState, dispatch ] = useReducer(inputReducer, initialState)
    const inputChangeHandler = (text) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        dispatch({
            type : INPUT_CHANGE,
            value : text,
            isValid : isValid
        })
    }
    return (
        <View style={styles.container}>
            <Text styles={styles.label}>
                {props.label}
            </Text>
            <TextInput {...props}
                       style={styles.input}
                       value={props.value}
                       onChangeText={props.onChangeText}
                       />
            {
                !props.isValid && (
                    <Text style={styles.errorText}>
                        {props.errorText}
                    </Text>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        marginVertical : 10
    },
    label : {
        fontSize : 20,
        marginVertical : 8
    },
    input : {
        paddingHorizontal : 2,
        paddingVertical : 5,
        borderBottomColor : '#ccc',
        borderBottomWidth : 1
    },
    errorText : {
        color : 'red'
    }
})
export default Input
