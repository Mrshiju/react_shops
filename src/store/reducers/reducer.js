import { combineReducers } from 'redux'
import { CartReducer } from './CartReducer'
import { UserReducer } from './UserReducer'
import {baseUrl} from './base'
const RootReducer = combineReducers({
    CartModule: CartReducer,
    userModule: UserReducer,
    baseModule: baseUrl
})
export default RootReducer