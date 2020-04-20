import {createStore, applyMiddleware} from 'redux'
import RootReducer from './reducers/reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: hardSet,
};
const myPersistReducer = persistReducer(persistConfig, RootReducer)
let store = createStore(myPersistReducer, applyMiddleware(logger, thunk))
export const persistor = persistStore(store)
export default store