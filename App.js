import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk'

import productsReducer from './store/reducers/product';
import cartReducer from './store/reducers/cart'
import ordersReducer from './store/reducers/order'
import ShopNavigator from './navigation/ShopNavigator'

const rootReducer = combineReducers({
    products : productsReducer,
    cart : cartReducer,
    orders : ordersReducer
})

const store= createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App() {
  return (
    <Provider store={store}>
        <ShopNavigator />
    </Provider>
  );
}
