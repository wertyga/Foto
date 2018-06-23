import axios from 'axios';
import jwt from 'jsonwebtoken';

import { globalError } from './errors';

import clientConfig from '../../server/common/clientConfig';

export const CLEAR_FILES_LIST = 'CLEAR_FILES_LIST';

export function uploadFotos(data) {
    return dispatch => {
        return axios({
            method: 'post',
            url: '/upload/users-fotos/' + jwt.sign({ user: data.user, contacts: data.contacts, orderName: data.orderName }, clientConfig.secret),
            data: data.data,
            onUploadProgress: data.onUploadProgress,
            cancelToken: data.cancelToken
        }).catch(err => {
            if(err.response && err.response.data.error.globalError) {
                dispatch(globalError(err.response ? err.response.data.error.globalError : err.message));
                throw err;
            } else {
                throw err
            };
        });

    }
};

export function clearFileList() {
    return dispatch => {
        return dispatch({
            type: CLEAR_FILES_LIST
        })
    };
};