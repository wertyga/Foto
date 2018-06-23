import { FETCH_PRODUCT } from '../actions/products';

export default function products(state = [], action = {}) {
    switch(action.type) {
        case FETCH_PRODUCT:
            return action.product

        default: return state;
    };
};