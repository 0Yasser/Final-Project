import { combineReducers, createStore } from "redux"
import token from "./login"
import user from './user'
import trigger from "./trigger"

const reducers = combineReducers({token,user,trigger})
const store = createStore(reducers)
export default store;