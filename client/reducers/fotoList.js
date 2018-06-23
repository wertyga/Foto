import { ADD_FOTO, DELETE_FOTO } from '../actions/params';
import { CLEAR_FILES_LIST } from '../actions/upload';

export default function products(state = [], action = {}) {
    switch(action.type) {
        case ADD_FOTO:
            const indexExistItem = state.findIndex(item => item.id === action.params.id);
            if(indexExistItem === -1) {
                return [...state, ...action.params]
            } else {
                return state.map((item, i) => {
                    if(i === indexExistItem) {
                        return {
                            ...item,
                            ...action.params
                        }
                    } else {
                        return item
                    };
                })
            };


        case DELETE_FOTO:
            return state.filter(item => item.id !== action.id);

        case CLEAR_FILES_LIST:
            return []

        
        default: return state;
    };
};