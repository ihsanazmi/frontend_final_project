import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import thunk from 'redux-thunk'

import 'primereact/resources/primereact.css'
import 'primereact/resources/themes/nova-light/theme.css'
import 'primeicons/primeicons.css';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'

import reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let _store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
    <Provider store = {_store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);