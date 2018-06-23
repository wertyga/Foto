import { LOGIN_ADMIN } from '../actions/auth';

const initialState = {
    isAuth: false,
    name: ''
};

export default function admin(state = initialState, action = {}) {
    switch(action.type) {

        case LOGIN_ADMIN:
            return {
                ...state,
                isAuth: true,
                name: action.admin.name
            }

        default: return state;
    }
};