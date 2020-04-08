import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, Checkbox, WingBlank, Stepper, SwipeAction, Toast } from 'antd-mobile'
import emptyCart from '../assets/imgs/cart_empty.png'
import { getCartGoods, syncCart , deletCart} from '../api/index'
import '../style/cart.css'
import ContentLoader from 'react-content-loader'
const CheckboxItem = Checkbox.CheckboxItem;
const alert = Modal.alert;
const Loader = () => {
  let loader = []
  for(let i = 0 ; i < 4 ;i++){
   loader.push( <ContentLoader viewBox="0 0 400 150" key={i} style={{background:"white"}}>
   {/* Only SVG shapes */}    
   <circle cx="30" cy="80" r='10'  />
   <rect x="100" y="50" rx="3" ry="3" width="70" height="80" />
   <rect x="180" y="50" rx="3" ry="3" width="200" height="40" />
   <rect x="180" y="110" rx="3" ry="3" width="70" height="20" />
   <rect x="280" y="110" rx="3" ry="3" width="40" height="20" />
   <rect x="340" y="110" rx="3" ry="3" width="40" height="20" />
 </ContentLoader>)
  }
  return loader
}
export class Cart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // 购物车数据 格式为{cartId: 购物车信息}
      cart_infos:[],
      // 购物车是否为空，否的话为空
      cart_infos_Status: true,
      // stepper改变数量的值
      num: '',
      // totalPrice是底部的总价
      totalPrice: 0,
      // allStatus即全选按钮是否选择，默认不选中
      allStatus: false,
      // 右下角选择去结算的商品种类数量
      allSelectedNum: 0,
      // 选择的商品总个数 商品种类*单个商品的amount
      selectedGoodsTotalNum: 0,
      // totalNum为购物车商品种类的数量
      totalNum: 0,
      // manage是为了点击右上角的管理时是否显示底部的删除按钮
      manage: true,
      list:[]
    }
  }
  componentWillMount() {

    // render之前获取购物车数据
    this.init()
  }

  // 初始化
  init = () => {
    
    
   
    
    getCartGoods().then(res => {
      // 将数据解构处理
      // 状态码200表示获取购物车数据成功
      if(res.data.data){
        let list = res.data.data;
        list.forEach((item,index) => {
          item.selectedStatus = false
        })

        this.setState({
          list,
          cart_Infos : list,
          cart_infos_Status:true,
          totalNum:res.data.data.length
        })
      }else{
        this.setState({
          cart_infos_Status:false
        })
      }
      console.log(this.state.cart_infos);
    })
  }
  // 同步购物车数据
  syncCartGoodsData = () => {
  
    // 计算CartReducer中的totalNum
    this.props.snycCartGoods(this.state.list, this.state.totalPrice, this.state.selectedGoodsTotalNum)
  }

  // 改变商品数量（stepper)
  handleUpdateNum = (num, cartId ,pcount) => {
    // 更新被点击的商品的数量
    console.log(num,pcount);
    let infos = {
      cartId:cartId,
      count:num - pcount,
    }
    syncCart(infos).then(res => {
      console.log(res);
      
    })
    // syncCart(infos).then(res => {
    //   console.log(res);
      
    // })
    const cart_infos = this.state.list
    cart_infos.filter((item,index)=>{
      if(item.cartId == cartId){
        return item.pcount = num
      }
    })
    this.setState({
      num,
      cart_infos,
    }, () => {
      // 计算总价
      this.calTotalPrice()
      // 同步购物车
      this.syncCartGoodsData()
    })
  }
  // 改变对应商品是否选择的状态
  changeSingleSelectedStatus = (e, cartId) => {
    // 同步状态
    let cart_infos = this.state.list
   
    cart_infos.filter((item,index) => {
      if(item.cartId == cartId){
       return item.selectedStatus = e.target.checked
      }
    })
    // cart_infos[cartId].selectedStatus = e.target.checked
    // 判断所有商品是否都选中
    this.isAllSelected()
    // 计算总价
    this.calTotalPrice()
    this.setState({
      // 更新购物车商品信息
      list:cart_infos,
      cart_infos: cart_infos,
      // 判断是增函数减选择的商品数量
      allSelectedNum: e.target.checked ? this.state.allSelectedNum + 1 : this.state.allSelectedNum - 1
    })
  }
  // 判断所有商品是否都选中
  isAllSelected = () => {
    // 先预设全选状态为true
    // let allSelected = true
    let allSelected ;
  
    // 循环判断每个商品是否都选中
    this.state.list.forEach((item)=>{
      if(item.selectedStatus == false){
        allSelected = false;
      }else{
        allSelected = true;

      }

    })
    
    this.setState({
      allStatus: allSelected
    })
  }
  // 点击全选框
  handleAllChecked = () => {
    // 获取商品信息
    
    let cart_infos = this.state.list
    // 循环遍历每个商品，设置是否选中,与allStatus同步
    cart_infos.forEach((item,index) => {
      item.selectedStatus = this.state.allStatus
    })
    
    this.setState({
      cart_infos,
      allSelectedNum: this.state.allStatus ? cart_infos.length : 0
    })
    // 计算总价
    this.calTotalPrice()
  }
  // 计算总价
  calTotalPrice = () => {
    let totalPrice = 0
    let selectedGoodsTotalNum = 0
    let cart_Infos = this.state.list
    cart_Infos.forEach((item,index)=>{
      if(item.selectedStatus == true){
        totalPrice += item.pcount * item.wxPrice
        selectedGoodsTotalNum += item.pcount
      }
    })
  
    this.setState({
      totalPrice,
      selectedGoodsTotalNum
    })
  }
  // 删除单个商品
  handleDeleteSingleGoods = cartId => {
    let cart_infos = this.state.list
    // 删除对应id的商品
    let cartIds = [];
    cartIds.push(cartId)
    deletCart(cartIds).then(res => {
      if(res.data.status == true){
        this.init()
      }
    })
    // cart_infos.forEach(item => {
    //   if(item.cartId == cartId){
    //     delete item
    //   }
    // })
    // 再更新state中的cart_infos
    this.setState({
      cart_infos,
      totalNum:this.state.list.length,
      allSelectedNum: this.state.allSelectedNum ? this.state.allSelectedNum - 1 : 0,
      // 如果购物车为空，则设置购物车信息状态为false，表示购物车清空了
      cart_infos_Status: !this.state.list.length ? false : true
    }, () => {
      // 同步购物车
      this.syncCartGoodsData()
      // 计算总价
      this.calTotalPrice()
    })

  }
  // 批量删除商品
  handleDeleteBatchGoods = () => {
    // 获取副本
    let cart_infos = this.state.cart_infos
    // 循环判断哪些商品被选中，选中的直接删除
    for (let cartId in cart_infos) {
      // 如果selectedStatus，即被选中，删除掉
      if (cart_infos[cartId].selectedStatus) {
        delete cart_infos[cartId]
      }
    }
    // 这里因为选中了商品，所以计算了所选中商品的总价和总商品数，故点击删除的时候要清零，否则删除后数字还在
    this.setState({
      cart_infos,
      totalPrice: 0,
      allSelectedNum: 0,
      selectedGoodsTotalNum: 0,
      totalNum: Object.values(cart_infos).length,
      // 如果购物车为空，则设置购物车信息状态为false，表示购物车清空了
      cart_infos_Status: !Object.values(cart_infos).length ? false : true
    }, () => {
      this.syncCartGoodsData()
    })
  }
  gotoPay = () => {
    // 提交订单之前判断是否选择了商品
    if (!this.state.allSelectedNum) {
      Toast.fail('您还没有选择宝贝呢', 2)
      return
    }
    // 将CartReducer中保存的数据更新
    this.props.snycCartGoods(this.state.list, this.state.totalPrice, this.state.selectedGoodsTotalNum)
    this.props.history.push('/pay')
  }

  render() {
    return (
      <div>
        
        {/* 顶部导航条 */}
        <nav className="nav-header">

          <div className="nav-header-center">
            购物车{this.state.totalNum ? `(${this.state.totalNum})` : ''}
          </div>
          <div className="nav-header-right">
            <span onClick={() => this.setState({ manage: this.state.manage ? false : true })} className="manage">
              {this.state.manage ? '管理' : '完成'}
            </span>
          </div>
        </nav>
        {
          !this.state.list.length&&<Loader />
        }
        {this.state.cart_infos_Status ?
          <WingBlank style={{ marginBottom: '1.6rem' }}>
            <div className="order-list" style={{ marginTop: '1.46666666rem' }}>
              
              
              {this.state.list.map((v) => (
                <SwipeAction
                  key={v.cartId}
                  style={{ marginBottom: '0.13333333rem' }}
                  autoClose
                  right={[
                    {
                      text: '取消',
                      style: { backgroundColor: '#ddd', color: 'white' },
                    },
                    {
                      text: '删除',
                      style: { backgroundColor: '#F4333C', color: 'white' },
                      onPress: () => alert('删除该宝贝', '确定吗?', [
                        {
                          text: '我再想想',
                          style: {
                            backgroundColor: '#777',
                            color: '#fff',
                            fontWeight: 700
                          }
                        },
                        {
                          text: '删除',
                          style: {
                            backgroundColor: 'rgb(244, 51, 60)',
                            color: '#fff',
                            fontWeight: 700
                          },
                          onPress: () => this.handleDeleteSingleGoods(v.cartId)
                        },
                      ]),
                    },
                  ]}
                >
                  <CheckboxItem
                    checked= {v.selectedStatus}
                    onChange={e => this.changeSingleSelectedStatus(e, v.cartId)}
                  >
                    <div className="single-order" style={{height:'3rem'}}>
                      <img src={this.props.baseUrl + v.bannerpic}
                        onClick={() => this.props.history.push(`/goodsdetail/${v.cartId}`)}
                        alt="" 
                        style={{height:'100%'}}
                        />
                      <div className="order-content">
                        <div className="order-title ellipsis-2"
                          onClick={() => this.props.history.push(`/goodsdetail/${v.cartId}`)}
                        >
                          {v.title}
                        </div>
                        <Stepper
                          showNumber
                          min={1}
                          defaultValue={v.pcount}
                          onChange={num => this.handleUpdateNum(num, v.cartId,v.pcount)}
                        />

                        <div className="order-price">
                          <span></span>
                          <span>&yen;{v.wxPrice}</span>
                        </div>
                      </div>
                    </div>
                  </CheckboxItem>
                </SwipeAction>
              ))}
            </div>
          </WingBlank>
          : <div className="empty-cart">
            {/* 此处的图片不能直接写路径，只能通过import的方式将它引入进来 */}
            <img src={emptyCart} alt="" className="empty-cart-img" />
            <div className="empty-cart-text1">购物车竟然是空的！</div>
            <div className="empty-cart-text2">再忙，也要记得买点什么犒劳自己~</div>
            <div className="btn" onClick={() => this.props.history.push('/')}>去逛逛</div>
          </div>
        }

        <div className="cart-footer">
          <div className="cart-footer-left" >
            <CheckboxItem
              checked={this.state.allStatus}
              onChange={() => {
                this.setState({
                  allStatus: !this.state.allStatus
                },
                  // 这里由于异步，所以等全选状态改变后再执行handleAllChecked
                  () => this.handleAllChecked())
              }}
            >
              全选
            </CheckboxItem>
          </div>
          {this.state.manage ?
            <div className="cart-footer-center">
              <span>合计：</span>
              <span className="total-price">￥ {this.state.totalPrice}</span>
            </div> : ''
          }
          {this.state.manage ?
            <div className="cart-footer-right" onClick={this.gotoPay}>
              <span className="goto-pay">结算{this.state.allSelectedNum ? `(${this.state.allSelectedNum}）` : ''}</span>
            </div>
            :
            <button className="delete-batch"
              onClick={() => this.state.selectedGoodsTotalNum ? alert(`删除这${this.state.allSelectedNum}个宝贝`, '确定吗?', [
                {
                  text: '我再想想', style: {
                    backgroundColor: '#777',
                    color: '#fff',
                    fontWeight: 700
                  }
                },
                {
                  text: '删除', style: {
                    backgroundColor: 'rgb(244, 51, 60)',
                    color: '#fff',
                    fontWeight: 700
                  }, onPress: () => this.handleDeleteBatchGoods()
                },
              ]) : Toast.fail('您还没选择宝贝呢', 2)}

            >删除</button>
          }
        </div>
      </div >
    )
  }
}
const mapStateToProps = state => {

  return {
    baseUrl: state.baseModule.baseUrl
  }
}
// 创建映射函数
const mapActionToProps = (dispatch) => {
  return {
    // 同步购物车数据
    snycCartGoods: (cart_Infos, totalPrice, selectedGoodsTotalNum) => {
      dispatch({ type: 'SYNC_CART_GOODS', payload: { cart_Infos, totalPrice, selectedGoodsTotalNum } })
    }
  }
}

export default connect(mapStateToProps, mapActionToProps)(withRouter(Cart))
