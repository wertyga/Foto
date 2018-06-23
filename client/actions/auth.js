import axios from 'axios';
import jwtDecode from 'jwt-decode';

import setTokenHeader from '../common/commonFunctions/setTokenHeader';
import setLocalStorage from '../common/commonFunctions/setLocalStorage';

import { clearFileList } from './upload';

import { globalError, setGlobalError } from './errors';

export const SET_USER = 'SET_USER';

export const setUser = user => {
    return dispatch => {
        if(!user) dispatch(clearFileList());
        dispatch(userSet(user))
    };
};
export function userSet(user) {
    return {
        type: SET_USER, 
        user
    }
};

export const loginAction = loginData => {
    return dispatch => {
        return axios.post('/user/api/login-register', loginData)
            .then(res => {
                const user = jwtDecode(res.data.token);
                setLocalStorage(res.data.token);
                setTokenHeader(res.data.token);
                dispatch(clearFileList());
                dispatch(userSet(user));
            })
            .catch(err => {
                if(err.response.data.error.globalError) {
                    dispatch(globalError(err.response.data.error.globalError))
                } else {
                    throw {...err.response.data.error}
                };
            })
    };
};

export function recoveryPass(user) {
    return dispatch => {
        return axios.post('/user/api/recovery-pass', user)
            .catch(err => {
                if(err.response) {
                    throw err;
                } else {
                    dispatch(globalError(err.message))
                };
            });
    }
};

export function updatePassword(data) {
    return dispatch => {
        return axios.post('/user/update-password', data)
            .catch(err => {
                err = err.response ? err.response.data.error : err.message;
                dispatch(globalError(err));
                throw new Error(err);
            })
    }
};

export function renameUser(data) {
    return dispatch => {
        return axios.post('/user/api/rename-user', data)
            .then(res => {
                const user = jwtDecode(res.data.token);
                setLocalStorage(res.data.token);
                setTokenHeader(res.data.token);

                dispatch(setGlobalError(''));
                dispatch(userSet(user));
            })
            .catch(err => {
                if(err.response && !err.response.data.globalError) {
                    throw err;
                } else {
                    dispatch(globalError((err.response && err.response.data.globalError) ? err.response.data.globalError : err.message))
                };
            })
    };
};

