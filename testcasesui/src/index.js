import React from 'react';
import ReactDOM from 'react-dom';

import { store } from './_helpers';
import { Provider } from 'react-redux';
import App from './app';
import "./style.sass";

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root'))    