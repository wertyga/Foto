import { FETCH_ORDERS, DELETE_ORDER } from '../actions/products';

export default function(state = [], action = {}) {
    switch(action.type) {
        case FETCH_ORDERS:
            return action.orders;

        case DELETE_ORDER:
            return state.filter(item => item.orderName !== action.id);

        default: return state;
    }
};