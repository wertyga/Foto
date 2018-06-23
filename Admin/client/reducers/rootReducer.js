import { combineReducers } from 'redux';
import admin from './admin';
import globalError  from './globalError';
import adminProductsPage  from './products';
import fotoParams from '../../../client/reducers/fotoParams';
import orders from './orders';

export default combineReducers({
    admin,
    globalError,
    fotoParams,
    adminProductsPage,
    orders
});