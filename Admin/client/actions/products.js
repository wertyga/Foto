import axios from 'axios';

import { globalError } from './errors';


export const FETCH_CATS = 'FETCH_CATS';
export const ADD_EDIT_PRODUCT = 'ADD_EDIT_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CHANGE_SHOW = 'CHANGE_SHOW';

export const fetchCategory = value => {
    return dispatch => {
        return axios.post(`/admin/get-category`, { value })
            .then(res => dispatch(fetchCats(res.data.products)))
            .catch(err => {
                dispatch(globalError(err.response.data.errors));
                throw err;
            })
    }
};
export function fetchCats(products) {
    return {
        type: FETCH_CATS,
        products
    }
};

export function saveProduct(data, productId) {
    return dispatch => {
        return axios({...data, method: 'post', url: '/admin/edit-product'})
            .then(res => {
                const newProduct = res.data.product;
                const deletedProduct = newProduct._id !== productId ? productId : false;
                dispatch(editProduct({...newProduct, deletedProduct} ))

            })
            .catch(err => {
                if(axios.isCancel(err)) {
                    return;
                } else {
                    err = err.response ? err.response.data.errors : err.message
                    dispatch(globalError(err));
                };
                throw err;
            });
    }
};
function editProduct(product) {
    return {
        type: ADD_EDIT_PRODUCT,
        product
    }
};

export function deleteProduct(data) {
    return dispatch => {
        return axios.post('/admin/delete-product', {data})
            .then(() => dispatch(deleteProd(data.id)))
    }
};
function deleteProd(id) {
    return {
        type: DELETE_PRODUCT,
        id
    }
};

export function changeShowProduct(_id, category) {
    return dispatch => {
        return axios.post('/admin/change-show', { _id, category })
            .then(res => dispatch(showChange(_id)))
            .catch(err => { throw err })
    };
};
function showChange(_id) {
    return {
        type: CHANGE_SHOW,
        _id
    };
};