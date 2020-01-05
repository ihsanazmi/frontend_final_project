
export const sendData = (username, id, role, avatar, name, phone_number )=>{
    return{
        type: "LOGIN_SUCCESS",
        payload:{
            username, id, role, avatar, name, phone_number
        }
    }
    
}

export const logOut = ()=>{
    localStorage.removeItem('userdata')
    return{
        type: "LOGOUT_SUCCESS"
    }
}

export const keepLogin = (userData)=>{
    return {
        type:"LOGIN_SUCCESS",
        payload:{
            id: userData.id,
            username: userData.username,
            role: userData.role,
            avatar: userData.avatar,
            phone_number: userData.phone_number,
            name: userData.name
        }
    }
}