import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import jwtDecode from 'jwt-decode';
import axios from 'axios';

import clientConfig from '../server/common/clientConfig';

import setTokenHeader from './common/commonFunctions/setTokenHeader';
import setLocalStorage from './common/commonFunctions/setLocalStorage';
import { validateToken } from '../server/common/validate';

import { userSet } from './actions/auth';

import rootReducer from './reducers/rootReducer';
import './styles/font-awesome.css';
import './styles/index.sass';

import favicon from '../server/favicon.png';

const env = process.env.NODE_ENV === 'development';
let store;
if(env) {
    store = createStore(
        rootReducer,
        composeWithDevTools(
            applyMiddleware(thunk)
        )
    );
} else {
    store = createStore(
        rootReducer,
        applyMiddleware(thunk)
    );
};
const link = document.createElement('link');
link.setAttribute('rel', 'shortcut icon');
link.setAttribute('href', favicon);
link.setAttribute('type', 'image/png');
document.head.appendChild(link)

if(localStorage[clientConfig.localStorageProperty]) {
    const token = localStorage[clientConfig.localStorageProperty];
    const isValid = validateToken(token);
    try {
        if(isValid) {
            const userObj = jwtDecode(token);
            if(!userObj.username) {
                throw new Error('No user');
            } else {
                axios.post('/user/check-user', { username: userObj.username })
                    .then(() => {
                        setTokenHeader(token);
                        store.dispatch(userSet(jwtDecode(token)));
                    })
                    .catch((err) => {
                        console.log(err)
                        setLocalStorage();
                        setTokenHeader();
                        store.dispatch(userSet({}));
                        window.location.href = '/';
                    })
            }
        } else {
            setLocalStorage();
            setTokenHeader();
            store.dispatch(userSet({}));
        }
    } catch(err) {
        console.log(err)
        setLocalStorage();
        setTokenHeader();
        store.dispatch(userSet({}));
        window.location.href = '/';
    };

};

ReactDOM.render (
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('app')
);
