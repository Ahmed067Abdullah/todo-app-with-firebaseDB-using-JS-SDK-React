import React from 'react';
import ReactDOM from 'react-dom';
import {initializeApp} from 'firebase';
import {createStore,  compose, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import authReducers from './store/reducers/auth';
import todosReducers from './store/reducers/todos';
import App from './App';
import './index.css';

const config = {
    apiKey: "AIzaSyBbYLdLgS-QDx68vUc1PnENNvrcfstMuJw",
    authDomain: "todo-app-with-firebasedb.firebaseapp.com",
    databaseURL: "https://todo-app-with-firebasedb.firebaseio.com",
    projectId: "todo-app-with-firebasedb",
    storageBucket: "todo-app-with-firebasedb.appspot.com",
    messagingSenderId: "960398132063"
};
initializeApp(config);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    auth : authReducers,
    todos : todosReducers
})

const store = createStore(reducers, composeEnhancers())

const app = (
    <Provider store ={store} >
        <App/>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
