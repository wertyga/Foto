import axios from 'axios';

export const PUBLIC_PARAMS = 'PUBLIC_PARAMS';
export const UPDATE_PARAMS = 'UPDATE_PARAMS';
export const ADD_FOTO = 'ADD_FOTO';
export const DELETE_FOTO = 'DELETE_FOTO';


export function fetchFotoParams() {
    return dispatch => {
        return axios.get('/fetch-foto-params')
            .then(res => dispatch(publicParams(res.data.params)))
    };
};
function publicParams(params) {
    return {
        type: PUBLIC_PARAMS,
        params
    };
};

export function updatePaperType(opt) {
    return dispatch => {
        return axios.post('/admin/update-foto-params', opt)
    }
};

export function addFotoParams(params) {
    return dispatch => {
        return Promise.resolve(dispatch(addFoto(params)))
    };
};
function addFoto(params) {
    return {
        type: ADD_FOTO,
        params
    };
};

export function deleteUserFoto(id) {
    return dispatch => {
        return dispatch({ type: DELETE_FOTO, id })
    };
};