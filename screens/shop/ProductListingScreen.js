import React, {useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, Platform, Button, ActivityIndicator, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Color'
import * as productActions from '../../store/actions/product'

const ProductListingScreen = (props) => {

    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState('')
    const dispatch = useDispatch()
    const availableProducts = useSelector(state => state.products.availableProducts)

    const loadProducts = useCallback(async() => {
        setError(null)
        try{
            setIsLoading(true)
            await dispatch(productActions.fetchProducts())
        }
        catch(err){
            setError(err.message)
        }
        setIsLoading(false)
    }, [setIsLoading, setError, dispatch])

    useEffect(() => {
        const addListenerToLoadProducts = props.navigation.addListener('willFocus', loadProducts)
        return () => {
            addListenerToLoadProducts.remove()
        }
    }, [loadProducts])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    if(isLoading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size='large'
                                   color={Colors.primaryColor}>
                </ActivityIndicator>
            </View>
        )
    }
    if(!isLoading && availableProducts.length == 0){
        return(
            <View style={styles.center}>
                <Text>
                    No products Found. Try adding some.
                </Text>
            </View>
        )
    }
    if(error){
        return(
            <View style={styles.center}>
                <Text>
                    Error occured
                </Text>
                <Button title="Try again"
                        color={Colors.primaryColor}
                        onPress={loadProducts}/>
            </View>
        )
    }
    return (
        <FlatList data={availableProducts}
                  keyExtractor={(item, index) => item.id}
                  renderItem={(itemData) => (
                        <ProductItem imageURL={itemData.item.imageURL}
                                     price={itemData.item.price}
                                     description={itemData.item.description} 
                                     addToCart={() => {
                                            dispatch(cartActions.addToCart(itemData.item))
                                     }}
                                     onTouch={() => {
                                         props.navigation.navigate('ProductDetail', {
                                            productID : itemData.item.id,
                                            productTitle : itemData.item.title
                                         })
                                     }}>
                            <Button title="VIEW DETAILS" 
                                    color={Colors.primaryColor}
                                    onPress={() => {
                                        props.navigation.navigate('ProductDetail', {
                                        productID : itemData.item.id,
                                        productTitle : itemData.item.title
                                    })}}/>
                                    
                            <Button title="ADD TO CART"
                                    color={Colors.primaryColor}
                                    onPress={() => dispatch(cartActions.addToCart(itemData.item))}/>
                        </ProductItem>
                  )}/>
    )
}

ProductListingScreen.navigationOptions = (navData) => {
    return {
        headerRight : () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="CART"
                      iconName={Platform.OS == 'ios' ? "ios-cart" : "ios-cart-outline"}
                      onPress={() => navData.navigation.navigate('Cart')}/>
            </HeaderButtons>
        ),
        headerLeft : () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="MENU"
                      iconName={Platform.OS == 'ios' ? "ios-menu" : "ios-menu-outline"}
                      onPress={() => navData.navigation.toggleDrawer()}/>
            </HeaderButtons>
        ),
    }
}

const styles= StyleSheet.create({
    center : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    }
})

export default ProductListingScreen
