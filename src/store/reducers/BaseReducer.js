let initState = {
    baseUrl: "http://sms-shop.oss-cn-beijing.aliyuncs.com/",
    token:'4832d662-77c1-4e67-8380-c1a608523ac6',
    ordertoken:"445454545"
}


export const BaseReducer = (state = initState, action) => {
    switch (action.type) {
        // 想买时
        case 'GET_ORDERTOKEN':
            // 登录成功则将token存入会话存储
            return {...state, ordertoken: action.payload.ordertoken}
       
        default:
            return {...state}
    }
    // return {...state}
}