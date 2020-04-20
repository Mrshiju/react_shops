// 初始token为空
let initState = {
    loginState: false,
    name: null,
    phone: null,
    address: null,
    count:1,
    des:'',
    uid:null
}
export const UserReducer = (state = initState, action) => {
    switch (action.type) {
        // 如果改变了登录状态
        case 'CHANGE_LOGIN_STATE':
            // 登录成功则将token存入会话存储
            if (action.payload.Login) {
                sessionStorage.setItem('token', action.payload.token)
            }
            return {...state, loginState: action.payload.Login}
        // 保存地址信息
        case 'SAVE_ADDRESS_INFO': 
            return {...state, ...action.payload}
        // 退出账号
        case 'LOGINOUT':
            sessionStorage.removeItem('token')
            return {...state, loginState: false}
        case 'BUY_PRODUCT':
            return {...state,count:action.payload.count,des:action.payload.des}  
        case 'SAVE_UID':
            return {...state,uid:action.payload.uid}
        default:
            return {...state, loginState: sessionStorage.getItem('token')? true: false}
    }
}