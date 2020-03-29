import axios from 'axios'
import qs from 'querystring'
import {baseUrl} from '../store/reducers/base'

// 设置公共请求前缀
// 或者 https://www.ehomespace.com/api/public/v1
// 或者 https://autumnfish.cn/wx/api/public/v1
// 或者 https://api.zbztb.cn/api/public/v1
// axios.defaults.baseURL = 'api/'

let base = baseUrl();
const token = base.token;
var axiosToken = axios.create();
axiosToken.defaults.timeout = 2500;
axiosToken.defaults.headers.common['Authorization'] = token
// 设置请求头token
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')

// 获取首页商品列表数据
export const getHomeGoodslist = () => axios.get('api/showAllInfo')
// 首页下拉加载更多商品
export const getMoreproducte = (pageINfo) => axios.get('api/moreProducts',{params:pageINfo})
// 获取分类
export const getCategory = () => axios.get('api/showProducts')
// 获取商品详情
export const getGoodsDetail = (id) => axios.get('/goods/detail?goods_id=' + id)
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
export const getCartGoods = () => axiosToken.get('api/cart/showCart')
// 购物车添加数量
export const syncCart = (infos) => axiosToken.post('api/cart/upCart', infos)
// 添加购物车
export const addCart = goodsInfo => axios.post('/my/cart/add', goodsInfo)
// 删除购物车
export const deletCart = cartId => axiosToken.post('api/cart/batchDelCart',cartId)
// 获取个人中心佣金
export const getCommis = () => axiosToken.get('api/member/showUserInfo')
// 同步购物车
// 创建订单
export const createOrder = goodsInfo => axios.post('/my/orders/create', goodsInfo)
// 获取订单
export const getOrder = () => axiosToken.get('api/order/getOrderList')
// 获取用户信息
export const getUserInfo = () => axios.get('/my/users/userinfo')

//添加地址
export const addAdress = (address) => axiosToken("api/upAddress",address)