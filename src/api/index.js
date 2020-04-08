import axios from 'axios'
import qs from 'querystring'
import store from '../store/store'
import { OrderList } from '../views/OrderList';
 

let base = store.getState();

var token = base.baseModule.token;
var axiosToken = axios.create();
axiosToken.defaults.timeout = 2500;
axiosToken.defaults.headers.common['Authorization'] = token
axios.defaults.baseURL = 'https://shop-wx.yunrongt.com'
axiosToken.defaults.baseURL = 'https://shop-wx.yunrongt.com'
// 设置请求头token
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')

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
export const searchGoods = value => axios.get('/goods/search?' + value)
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

//添加地址
export const addAdress = (address) => axiosToken("/upAddress",address)
//删除地址
export const deletAdress = (addressId) => axiosToken.get("/delAddress?addressid=" + addressId)
// 分类下拉加载更多
export const classMore = (data) => axios.get("/showProductByCid",{params:data})
// 购买获取ordertoken
export const wantBuy = () => axiosToken.post("/order/wantBuy")
// 添加订单
export const addOrder = (OrderList) => axiosToken.post("/order/addOrder",OrderList)