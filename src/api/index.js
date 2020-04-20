import axios from 'axios'
import qs from 'querystring'
import store from '../store/store'
import { OrderList } from '../views/OrderList';
var base,token
var axiosToken = axios.create();
axiosToken.defaults.timeout = 2500;
store.subscribe(() => {
    base = store.getState();   //这就是你获取到的数据state tree，由于使用了subscribe，当数据更改时会重新获取
    token = base.baseModule.token
    axiosToken.defaults.headers.common['Authorization'] = token
   
})

axios.defaults.baseURL = 'https://shop-wx.yunrongt.com'
axiosToken.defaults.baseURL = 'https://shop-wx.yunrongt.com'
// 设置请求头token
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
// 获取token
export const getToken = (code) => axios.get('/loginCheck?code=' + code)
// 获取首页商品列表数据
export const getHomeGoodslist = () => axios.get('/showAllInfo')
// 首页下拉加载更多商品
export const getMoreproducte = (pageINfo) => axios.get('/moreProducts',{params:pageINfo})
// 获取分类
export const getCategory = () => axios.get('/showProducts')
// 获取分类详情页
export const getCategoryPage = () => axios.get('/showProducts')
// 获取商品详情
export const getGoodsDetail = (id) => axios.get('/getProductByProId?productId=' + id)
// 登录账号
export const submitLogin = (userInfoObj) => axios.post('/login', qs.stringify(userInfoObj))
// 注册账号
export const submitRegister = (registerObj) => axios.post('/users/reg',qs.stringify(registerObj))
// 获取验证码
export const getVerigyCode = mobile => axios.post('/users/get_reg_code', qs.stringify({mobile}))
// 搜索商品
export const searchGoods = value => axios.get('/search' ,{params: value} )
// 搜索建议查询
export const searchSuggest = value => axios.get('/goods/search?query=' + value)
// 获取购物车数据
export const getCartGoods = () => axiosToken.get('/cart/showCart')
// 购物车添加数量
export const syncCart = (infos) => axiosToken.post('/cart/upCart', infos)
// 添加购物车
export const addCart = goodsInfo => axiosToken.post('/cart/addCart', goodsInfo)
// 删除购物车
export const deletCart = cartId => axiosToken.post('/cart/batchDelCart',cartId)
// 获取个人中心佣金
export const getCommis = () => axiosToken.get('/member/showUserInfo')
// 删除订单
export const delOrder = (list) => axiosToken.post('/order/delOrder',list)
// 同步购物车
// 获取个人地址
export const showAddressList = () => axiosToken.get('/showAddress')
// 创建订单
export const createOrder = goodsInfo => axios.post('/my/orders/create', goodsInfo)
// 获取订单
export const getOrder = () => axiosToken.get('/order/getOrderList')
// 获取用户信息
export const getUserInfo = () => axios.get('/my/users/userinfo')
// 更新地址
export const upAddress = (data) => axiosToken.post('/upAddress',data)
//添加地址
export const addAdress = (address) => axiosToken.post("/addAddress",address)
//删除地址
export const deletAdress = (addressId) => axiosToken.get("/delAddress?addressid=" + addressId)
// 分类下拉加载更多
export const classMore = (data) => axios.get("/showProductByCid",{params:data})
// 购买获取ordertoken
export const wantBuy = () => axiosToken.post("/order/wantBuy")
// 添加订单
export const addOrder = (OrderList) => axiosToken.post("/order/addOrder",OrderList)
// 点击一级菜单
export const getProductByOne = (data) => axios.get("/getProductByOne",{params:data})
// 确认token是否过期
export const overdueToken = () => axiosToken.get("/tokenCheck")
// 再次付款
export const payAling = (orderNumber) => axiosToken.get("/order/payByOrder?type=wx&orderNumber=" + orderNumber)
// 退款
export const refund = (orderId) => axiosToken.get("/order/salesReturn?orderId=" + orderId)
//  转发
export const transmit = (url) => axiosToken.get("/order/shareId?accurl=" + url) 
// shareShop list
export const getSharelist = () => axios.get('/salesPromotion')
// get order detail
export const getOrderdetail = (orderNumber) =>axiosToken.get("/order/orderItem?orderNumber=" + orderNumber)
// get invite info
export const getInvite = () => axiosToken.get('/member/showInviteInfo')
// get feedback info
export const getFeedBack = () => axiosToken.get('/member/showProperty')
// cash money
export const cashMoney = (userVal) => axiosToken.get("/member/applyCash?money=" + userVal)
// cash money info
export const cashMoneyInfo = () => axiosToken.get('/member/cashInfo')