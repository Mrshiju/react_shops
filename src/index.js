import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './App';
import store from './store/store';
import './api/index'
// 引入全局样式
import './style/index.css'
// 处理点击移动端事件
import FastClick from 'fastclick';
import {persistor} from './store/store'
import {PersistGate} from 'redux-persist/lib/integration/react';
FastClick.attach(document.body);
ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
, document.getElementById('root'));

