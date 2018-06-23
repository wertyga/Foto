import { SET_USER } from '../actions/auth';

export default function admin(state = {}, action = {}) {
    switch(action.type) {

        case SET_USER:
            return action.user || {};

        default: return state;
    }
};;