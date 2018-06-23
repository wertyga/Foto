import { GET_ORDERS, UPDATE_ORDER_STATUS, DELETE_ORDER } from '../actions/orders';

export default function orders(state = [], action = {}) {
    switch(action.type) {

        case GET_ORDERS: {
            return action.orders;
        }

        case UPDATE_ORDER_STATUS: {
            return state.map(item => {
                if(item.orderName === action.order.orderName) {
                    return {
                        ...item,
                        status: action.order.status
                    };
                } else {
                    return item;
                };
            });
        }

        case DELETE_ORDER: {
            return state.filter(item => item.orderName !== action.orderName)
        }

        default: return state;
    }
};