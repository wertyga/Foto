import axios from 'axios';

import { globalError } from './errors';


export const LOGIN_ADMIN = 'LOGIN_ADMIN'

export const authAdmin = data =>
    dispatch => {
        return axios.post('/admin/api/login', data)
            .then(res => {
                dispatch(loginAdmin(res.data.user))
            })
            .catch(err => {
                if(err.response) {
                    if(err.response.data.errors.name || err.response.data.errors.password) {
                        throw err.response.data.errors;
                    } else {
                        dispatch(globalError(err.response.data))
                    }
                }
            })
    };
const loginAdmin = admin => {
    return {
        type: LOGIN_ADMIN,
        admin
    }
};
