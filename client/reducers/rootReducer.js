import { combineReducers } from 'redux';
import user from './user';
import products from './products';
import globalError  from './globalError';
import fotoParams from './fotoParams';
import fotoList from './fotoList';
import orders from './orders';


export default combineReducers({
    products,
    globalError,
    fotoParams,
    fotoList,
    user,
    orders
});