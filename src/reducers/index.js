import {combineReducers} from 'redux'

let initState = {
    id: 0,
    username:'',
    role: '',
    avatar: '',
    name: '',
    phone_number : ''
}

let authReducer = (state = initState, action)=>{
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {...state, id:action.payload.id, username: action.payload.username, role:action.payload.role, avatar: action.payload.avatar, name: action.payload.name, phone_number: action.payload.phone_number}
        case "LOGOUT_SUCCESS":
            return {...state, ...initState}
        default:
            return state
    }
}

let reducers = combineReducers(
    {
        auth: authReducer
    }
)

export default reducers