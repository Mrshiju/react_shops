let initState = {
    baseUrl: "http://sms-shop.oss-cn-beijing.aliyuncs.com/",
    token: 'c582d6a0-cfa0-4f80-a245-2c1f0ced3fce',
    ordertoken: "",
}


export const BaseReducer = (state = initState, action) => {
    switch (action.type) {
        // 想买时
        case 'GET_ORDERTOKEN':
            // 登录成功则将token存入会话存储
            return { ...state, ordertoken: action.payload.ordertoken }
            // token outtime
        case 'UPTOKEN':
            // 登录成功则将token存入会话存储
            return { ...state, token: action.payload.token }
            
        default:
            return { ...state }
    }
    // return {...state}
}