import React, { useState, useCallback, useEffect, useReducer } from 'react'
import { View, TextInput, ScrollView, Text, StyleSheet, Platform, Alert } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { createProduct, updateProduct } from '../../store/actions/product'

const FORM_UPDATE = 'FORM_UPDATE'

const reducer = (state, action) => {
    switch(action.type) {
        case FORM_UPDATE : {
            const updatedInputValues = {
                ...state.inputValues,
                [action.inputIdentifier] : action.value
            }

            const updatedInputValidities = {
                ...state.inputValidities,
                [action.inputIdentifier] : action.isValid
            }

            let updatedFormIsValid = true
            for(const key in updatedInputValidities){
                updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key]
            }
            return {
                ...state,
                inputValues : updatedInputValues,
                inputValidities : updatedInputValidities,
                isFormValid : updatedFormIsValid
            }
        }
        default : {
            return state
        }
    }
}

const EditProductScreen = (props) => {
    
    const dispatch = useDispatch()
    const productID = props.navigation.getParam('productID')
    const product = useSelector(state => state.products.availableProducts.find(product => product.id == productID))
  
    const initalState = {
        inputValues : {
            title : productID ? product.title : '',
            price : '',
            imageURL : productID ? product.imageURL : '',
            description : productID ? product.description : ''
        },
        inputValidities : {
            title : productID ? true: false,
            price :  productID ? true: false,
            imageURL :  productID ? true: false,
            description :  productID ? true: false,
        },
        isFormValid : productID ? true : false
    }

    const [ formState, dispatchFormAction ] = useReducer(reducer, initalState)

    const validate = (inputIdentifier,text) => {
        let isValid = false
        if(text.trim().length > 0){
            isValid = true
        }
        dispatchFormAction({
            type : FORM_UPDATE,
            value : text,
            isValid : isValid,
            inputIdentifier : inputIdentifier
        })
    }

    const onSaveHandler = useCallback(() => {
        if(!formState.isFormValid){
            Alert.alert(
                "Wrong input", 
                "Please check the errors in the form",
                [
                    {text : "OK", style:'default'}
                ])
        }
        if(formState.isFormValid){
            const formData = {
                title : formState.inputValues.title,
                price : formState.inputValues.price,
                imageURL : formState.inputValues.imageURL,
                description : formState.inputValues.description
            }
            productID ? dispatch(updateProduct(formData, productID)) : dispatch(createProduct(formData))
            props.navigation.goBack()
        }
    }, [formState,dispatch,productID])
    
    useEffect(() => {
        props.navigation.setParams({ save : onSaveHandler})
    }, [onSaveHandler])

    return (
        <ScrollView>
            <View style={styles.screen}>
                <View style={styles.container}>
                    <Text styles={styles.label}>TITLE</Text>
                    <TextInput style={styles.input}
                               value={formState.inputValues.title}
                               onChangeText={validate.bind(this,'title')}
                               returnKeyType='next'
                               keyboardType='default'/>
                </View>
                { !formState.inputValidities.title && <Text>Please enter valid input.</Text>}
                {
                    !productID &&
                    <View style={styles.container}>
                        <Text>PRICE</Text>
                        <TextInput style={styles.input}
                                value={formState.inputValues.price}
                                onChangeText={validate.bind(this,'price')}
                                keyboardType='decimal-pad'/>
                    </View>
                }

                <View style={styles.container}>
                    <Text>IMAGE URL</Text>
                    <TextInput style={styles.input}
                               value={formState.inputValues.imageURL}
                               onChangeText={validate.bind(this,'imageURL')}/>
                </View>
                <View style={styles.container}>
                    <Text>DESCRIPTION</Text>
                    <TextInput style={styles.input}
                               value={formState.inputValues.description}
                               onChangeText={validate.bind(this,'description')}/>
                </View>
            </View>
        </ScrollView>
    )
}

EditProductScreen.navigationOptions = (navData) => {
    const id = navData.navigation.getParam('productID')
    return {
        headerTitle : id ? 'EDIT PRODUCT' : 'ADD PRODUCT',
        headerRight : () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="SAVE"
                      iconName={Platform.OS == 'android' ? 'md-checkmark' : 'ios-checkmark'}
                      onPress={navData.navigation.getParam('save')}/>
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    screen : {
        margin : 20
    },
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
    }
})
export default EditProductScreen
