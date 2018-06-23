import findIndex from 'lodash/findIndex';

import { ADD_EDIT_PRODUCT, FETCH_CATS, DELETE_PRODUCT, CHANGE_SHOW } from '../actions/products';

export default function product(state = [], action = {}) {
    switch(action.type) {

        case ADD_EDIT_PRODUCT: {
            if(action.product.deletedProduct) {
                const deletedIndex = findIndex(state, item => item._id === action.product.deletedProduct);
                if(deletedIndex !== -1) state.splice(deletedIndex, 1);
            };
            const existProduct = findIndex(state, item => item._id === action.product._id);
            if(existProduct !== -1) {
                state[existProduct] = action.product;
                return state;
            } else {
                return [...state, action.product];
            }
        }

        case FETCH_CATS:
            return action.products;

        case  DELETE_PRODUCT:
            return state.filter(item => item._id !== action.id);

        case CHANGE_SHOW:
            return state.map(item => {
                if(item._id === action._id) {
                    return {
                        ...item,
                        show: !item.show
                    }
                } else {
                    return item;
                };
            });

        default: return state;
    }
};