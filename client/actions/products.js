import axios from 'axios';

import { globalError } from './errors';

export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const DELETE_ORDER = 'DELETE_ORDER';

export const fetchProducts = (product) => {
    return dispatch => {
        return axios.get(`/products/${product || 'all'}`)
            .then(res => dispatch(fetchProd(res.data)))
            .catch(err => { throw new Error(err) })
    };
};
const fetchProd = (product) => {
    return {
        type: FETCH_PRODUCT,
        product
    }
};

export const fetchOrders = _id => {
    return dispatch => {
        return axios.get(`/user/api/fetch-orders/${_id}`)
            .then(res => dispatch(ordersFetch(res.data)))
            .catch(err => dispatch(globalError(err.response ? err.response.data.error : err.message)));
    };
};
const ordersFetch = orders => {
    return {
        type: FETCH_ORDERS,
        orders
    }
};

export const deleteOrder = id => {
    return dispatch => {
        return axios.post('/user/api/delete-order', { id })
            .then(res => dispatch(orderDelete(id)))
            .catch(err => {
                if(err.response && err.response.status === 409) {
                    throw err;
                } else {
                    dispatch(globalError(err.response ? err.response.data.error : err.message))
                }
            })
    };
};
function orderDelete(id) {
    return {
        type: DELETE_ORDER,
        id
    }
};