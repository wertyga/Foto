import clientConfig from '../../../server/common/clientConfig';

export default function(token) {
    if(token) {
        localStorage.setItem(clientConfig.localStorageProperty, token);
    } else {
        localStorage.removeItem(clientConfig.localStorageProperty);
    }

};