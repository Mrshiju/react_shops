let initState = {
    totalNum: 0,
    payProductinfo:[],
    buyProCount:0,
    buyProPrice:0,
}

export const CartReducer = (state = initState, action) => {
    switch (action.type) {
        // 同步购物车数据
        case 'SYNC_CART_GOODS':
            let {cart_Infos} = action.payload
            let totalNum = 0;
            let payProductinfo = []
            // 通过循环遍历获取购物车商品总量
            cart_Infos.forEach((item,index) => {
                totalNum += item.pcount
                if(item.selectedStatus === true){
                    payProductinfo.push(item) 
                }
            });
            
            // 返回新的数据
            return {...state, totalNum,payProductinfo, ...action.payload}
        case 'ADD_CART':
            state.totalNum += 1
            return {...state}
        // 点击结算时保存购物车数据
        case 'BUY_NOW':
            return {...state, ...action.payload}
        case 'CLEAR': 
            return {}
        case 'ADD_PAYPRO':
            let buInfo = action.payload
            let buyProCount = 0;
            let buyProPrice = 0;
            buInfo.forEach((item) => {
                buyProCount += item.pcount
                buyProPrice += item.pcount*item.wxPrice
            });
            return {...state,buyProCount,buyProPrice,payProductinfo:action.payload}
        default:
        // 返回默认数据
        return state
    }
    
}