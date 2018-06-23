import { PUBLIC_PARAMS, UPDATE_PARAMS } from '../actions/params';

export default function products(state = [], action = {}) {
    switch(action.type) {
        case PUBLIC_PARAMS:
            return action.params;

        case UPDATE_PARAMS:
            return state.map(item => {
                if(item._id === action.data._id) {
                    return action.data
                } else {
                    return item
                }
            })

        default: return state;
    };
};