import axios from 'axios';

export const GET_ORDERS = 'GET_ORDERS';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';
export const DELETE_ORDER = 'DELETE_ORDER';

export function fetchOrders() {
    return dispatch => {
        return axios.post('/admin/api/get-orders', {})
            .then(res => dispatch(orderFetch(res.data.orders)))
            .catch(err => { throw err })
    };
};

function orderFetch(orders) {
    return {
        type: GET_ORDERS,
        orders
    }
};

export function changeStatus(data) {
    return dispatch => {
        return axios.post('/admin/api/change-order-status', data)
            .then(res => dispatch(updateOrders(res.data.order)))
            .catch(err => { throw err })
    }
};
function updateOrders(order) {
    return {
        type: UPDATE_ORDER_STATUS,
        order
    }
};

export function downloadFiles(orderName) {
    return axios.post(`/admin/api/download/${orderName}`)
};

export function deleteAdminOrder(orderName) {
    return dispatch => {
        return axios.get(`/admin/api/delete-order/${orderName}`)
            .then(() => dispatch(deleteOrder(orderName)))
            .catch(err => { throw err })
    }
};
function deleteOrder(orderName) {
    return {
        type: DELETE_ORDER,
        orderName
    }
};