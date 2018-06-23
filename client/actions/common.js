import axios from 'axios';

export const sendMessage = (data) => {
    return dispatch => {
        return axios.post('/send-message', data)
    }
};