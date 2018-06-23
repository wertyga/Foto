import { PUBLIC_PARAMS } from '../../../client/actions/params';

export default function orders(state = [], action = {}) {
    switch(action.type) {

        case GET_ORDERS: {
            return action.orders;
        }

        default: return state;
    }
};