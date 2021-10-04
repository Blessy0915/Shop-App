import React from 'react'
import { Button } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { useSelector, useDispatch } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import { FlatList } from 'react-native-gesture-handler'
import Colors from '../../constants/Color'
import { deleteProduct } from '../../store/actions/product'

const UsersProductsScreen = (props) => {
    const dispatch = useDispatch()
    const userProducts = useSelector(state => state.products.userProducts)
    return (
        <FlatList data={userProducts}
                  keyExtractor={(item,index) => item.id}
                  renderItem={(itemData) => ( 
                        <ProductItem imageURL={itemData.item.imageURL}
                                     price={itemData.item.price}
                                     description={itemData.item.description} 
                                     addToCart={() => {
                                        dispatch(cartActions.addToCart(itemData.item))
                                    }}
                                    onTouch={() => {}}>
                            <Button title="EDIT" 
                                    color={Colors.primaryColor}/>
                            <Button title="DELETE"
                                    color={Colors.primaryColor}
                                    onPress={() => dispatch(deleteProduct(itemData.item.id))}/>
                        </ProductItem>
                  )}/>
    )
}

UsersProductsScreen.navigationOptions = (navData) => {
    return {
        headerTitle : "YOUR PRODUCTS",
        headerLeft : () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="MENU"
                      iconName="ios-menu"
                      onPress={()=>navData.navigation.toggleDrawer()}/>
            </HeaderButtons>
        )
    }
}
export default UsersProductsScreen
