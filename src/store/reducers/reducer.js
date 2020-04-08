import { combineReducers } from 'redux'
import { CartReducer } from './CartReducer'
import { UserReducer } from './UserReducer'
import { BaseReducer } from './BaseReducer'
const RootReducer = combineReducers({
    CartModule: CartReducer,
    userModule: UserReducer,
    baseModule: BaseReducer
})
export default RootReducer