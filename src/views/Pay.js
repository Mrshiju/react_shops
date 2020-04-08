import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { NavBar, Icon, Toast, Stepper, Flex } from 'antd-mobile'
import { connect } from 'react-redux'
import { createOrder, syncCart, getGoodsDetail, getCartGoods ,addOrder} from '../api/index'
import '../style/pay.css'
export class Pay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cart_infos_Array: [],
      id: '',
      productInfo:[],
      val:1
    }
  }
  componentWillMount() {

    // render之前获取页面是否有id 如果是购物车跳转过来的话没有id，Number之后的NaN
    let id = Number(this.props.location.pathname.split('/').pop())
    console.log('====================================');
    console.log(id);
    console.log('====================================');
    let cart_infos_Array
    if (id) {
      this.setState({
        id
      })
      getGoodsDetail(id).then(res => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
        let productInfo = [];
       
        res.data.data.products.bannerpic = res.data.data.products.bannerpic.split(",")[0]
        productInfo.push(res.data.data.products)
        if(res){
          this.setState({
            productInfo
          })
        }
      })
    } else if (this.props.cart_Infos) {
      cart_infos_Array = Object.values(this.props.cart_Infos)
      this.setState({
        cart_infos_Array
      })
    }
  }
  // 提交订单
  submitOrder = () => {
    // 初始化goods数组
    let _this = this
    let goods = []
    let cart_infos
    //因为有可能从商品详情的立即购买跳转过来，也可能从购物车的结算跳转过来，所以分两条路径判断
    // 从商品详情的立即购买跳转过来location带有参数，购物车没有
    if (!this.state.id) {
      cart_infos = this.props.cart_Infos
      this.state.cart_infos_Array.forEach(v => {
        // 商品选中就将id，数量，价格存入goods数组中
        if (v.selectedStatus) {
          goods.push({
            goods_id: v.goods_id,
            goods_number: v.amount,
            goods_price: v.goods_price,
          })
          // 同时将订单中选择的商品删除
          delete cart_infos[v.goods_id]
        }
      })
    } else {
      // 如果从商品详情的立即购买跳转过来，要拿到购物车的数据，否则提交订单的时候购物车还没结算的数据会丢失
       console.log('====================================');
       console.log('提交订单',_this.props.orderToken);
       console.log('====================================');
       var datas ={
        address:"北京市 市辖区 西城区 测试",
        consignee:"王测试",
        goods:[
          {
            id:'1434',
            des:'绅士黑',
            goodsName:'蓝牙智能体脂称'
          }
        ],
        orderToken: this.props.ordertoken,
        phone: "13111182711",
        remark: "",
        type: "wx",
        uid:null
       };
       //获取购买信息
       addOrder(datas).then(res => {
         console.log('====================================');
         console.log(res);
         console.log('====================================');
         let data = res.data.data;
         window.wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: ''+data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.paySign,// 必填，签名
          jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
        });
          // ==== 开始处理初始化配置失败是提示信息 上述操作2 过程
        window.wx.error(function (err) {
          console.log("初始化失败！");
          alert(err);
        });
          //=== 此处在 config完成初始化配置之后调用支付函数
        window.wx.ready(() => {
            // 调用支付函数
          window.wx.chooseWXPay({
            appId: data.appId, // 可不发
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: data.paySign, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            success: function (res) {
              // 支付成功后的回调函数
              // alert(res.errorMsg)
              console.log('====================================');
              console.log('cheng');
              console.log('====================================');
            },
            fail: function (res) {
              alert("支付失败");
              alert(res.errMsg);
            }
  
          })
       }
      )}
    )}
  }
  // 数量
  onChange = (val) => {
    // console.log(val);
    this.setState({ val });
  }

  render() {
    return (
      <div>
        {/* 顶部导航条 */}
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          className="nav-bar-style"
        >确认订单</NavBar>
        <div style={{ margin: '60px 10px 0' }}>
          <div className="default-address"
            onClick={() => this.props.history.push('/address')}
          >
            <div className="left-icon">
              <i className="iconfont icon-dingwei" ></i>
            </div>
            <div className="address-info">
              <div className="address-info-top">
                <span className="name">{this.props.name}</span>
                <span className="phone">{this.props.phone}</span>
              </div>
              <div className="address-info-bottom">{this.props.address}</div>
            </div>
            <div className="right-icon">
              <i className="iconfont icon-youjiantou" ></i>
            </div>
          </div>

         {
         console.log(this.state.productInfo)
         }

          <div className="order-list">
            {this.state.productInfo ? this.state.productInfo.map(v => (
                <div key={v.id} >
                  <div className="pay-order">
                    <img src={this.props.baseUrl + v.bannerpic} alt="" />
                    <div className="pay-content">
                      <div className="pay-title ellipsis-2">{v.title}</div>
                    </div>
                    <div className="pay-price">
                      <span>&yen;{this.state.val * v.wxPrice}</span>
                      <span style={{color:'#ccc'}}>x{this.state.val  } </span>
                    </div>
                  </div>


                  <div className='buyInfo'>
                    <Flex
                      justify='between'
                    >
                        <div>购买数量</div>
                        <div>

                          <Stepper
                            style={{ width: '100%', minWidth: '100px' }}
                            showNumber
                            min={1}
                            value={this.state.val}
                            onChange={this.onChange}
                          />

                        </div>
                    </Flex>

                  <Flex
                      justify='between'
                      align='center'
                    >
                        <div>快递运费</div>
                        <div>
                          快递免邮
                        </div>
                    </Flex>
                    <Flex
                      justify='between'
                      align='center'
                    >
                        <div>订单备注</div>
                        <div>
                          <input className='xieshang'  placeholder='选填，请先和商家协商一致'></input>
                        </div>
                    </Flex>

                    </div>
                </div> 
            ))
              : ''
            }

          </div>
        </div>
        <div className="submit-order-footer">
          <div className="submit-order-footer-left">
            共{this.state.val}件
                </div>
          <div className="submit-order-footer-center">
            <span>合计：</span>
            <span className="total-price"><span>￥</span> {this.state.productInfo[0]&&this.state.val*this.state.productInfo[0].wxPrice}</span>
          </div>
          <div className="submit-order-footer-right" onClick={this.submitOrder}>
            <span className="submit-order">提交订单</span>
          </div>
        </div>

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    cart_Infos: state.CartModule.cart_Infos,
    totalPrice: state.CartModule.totalPrice,
    selectedGoodsTotalNum: state.CartModule.selectedGoodsTotalNum,
    name: state.userModule.name,
    phone: state.userModule.phone,
    address: state.userModule.address,
    baseUrl:state.baseModule.baseUrl,
    ordertoken:state.baseModule.ordertoken
  }
}

const mapActionToProps = (dispatch) => {
  return {
    // 同步购物车数据
    snycCartGoods: (cart_Infos) => {
      dispatch({ type: 'SYNC_CART_GOODS', payload: { cart_Infos } })
    }
  }
}
export default connect(mapStateToProps, mapActionToProps)(withRouter(Pay))
