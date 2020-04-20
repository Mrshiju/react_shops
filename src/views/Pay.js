import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { NavBar, Icon, Toast, Stepper, Flex } from 'antd-mobile'
import { connect } from 'react-redux'
import { createOrder, showAddressList, getGoodsDetail, getCartGoods, addOrder } from '../api/index'
import '../style/pay.css'
export class Pay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cart_infos_Array: [],
      buyType: 1,
      id: '',
      productInfo: [],
      val: '',
      totalNum: 0,
      totalPrice: 0
    }
  }
  componentWillMount(){
    if (this.props.name == null) {
      this.getList()
    }
    let proInfo = this.props.payProductinfo;
    let totalNum = 0
    let totalPrice = 0
    proInfo.forEach(item => {
      totalNum += item.pcount
      totalPrice += item.wxPrice * item.pcount
    })
    this.setState({
      totalNum,
      totalPrice,
      productInfo: proInfo
    })
    console.log('====================================');
    console.log(this.props.payProductinfo);
    console.log('====================================');
    // render之前获取页面是否有id 如果是购物车跳转过来的话没有id，Number之后的NaN
    let id = Number(this.props.location.pathname.split('/').pop())
    let cart_infos_Array
    if (id) {
      this.setState({
        id,
        val: this.props.payProductinfo[0].pcount,
        buyType: 1
      })

      // getGoodsDetail(id).then(res => {
      //   let productInfo = [];

      //   res.data.data.products.bannerpic = res.data.data.products.bannerpic.split(",")[0]
      //   res.data.data.products.count = this.props.count
      //   productInfo.push(res.data.data.products)
      //   if (res) {
      //     this.setState({
      //       productInfo
      //     })
      //   }
      // })
    } else {

      let productInfo = []
      cart_infos_Array = Object.values(this.props.cart_Infos)
      cart_infos_Array.forEach((item, index) => {
        if (item.selectedStatus == true) {
          productInfo.push(item)
        }
      })
      this.setState({
        buyType: 2,
        productInfo
      })
    }
  }
  componentDidUpdate(nextProps,nextState) {

  }
 
  componentDidMount() {
    
  }
  //获取地址
  getList = () => {
    showAddressList().then((res) => {

      if (res) {
        this.setState({
          addressList: res.data.data
        })
      }

      let address = this.state.addressList;
      if (address.length == 0) {
        this.props.SaveAddressInfo(null, null, null)
      } else {

        address.forEach(item => {
          if (item.status == 1) {
            this.props.SaveAddressInfo(item.name, item.phone, item.address)
          } else {
            this.props.SaveAddressInfo(address[0].name, address[0].phone, address[0].address)
          }
        })
      }
    })
  }
  // 提交订单
  submitOrder = () => {
    // 初始化goods数组
    let _this = this
    let cart_infos
    var datas
    if (this.props.name == null) {
      Toast.fail("请选择地址", 1)
      return false
    }
    //因为有可能从商品详情的立即购买跳转过来，也可能从购物车的结算跳转过来，所以分两条路径判断
    // 从商品详情的立即购买跳转过来location带有参数，购物车没有
    if (!this.state.id) {
      let goods = []
     
      this.state.productInfo.forEach(item => {
        let goosinfo = {}
        goosinfo.cartId = item.cartId
        goosinfo.id = item.proId
        goosinfo.count = item.pcount
        goosinfo.des = item.property
        goosinfo.goodsName = item.title
        goods.push(goosinfo)
       })
      datas = {
        address: this.props.address,
        consignee: this.props.name,
        goods,
        orderToken: this.props.ordertoken,
        phone: this.props.phone,
        remark: "",
        type: "wx",
        uid: this.props.uid
      }
    } else {
      // 如果从商品详情的立即购买跳转过来，要拿到购物车的数据，否则提交订单的时候购物车还没结算的数据会丢失

      datas = {
        address: this.props.address,
        consignee: this.props.name,
        goods: [
          {
            id: this.state.productInfo[0].proId,
            des: this.state.productInfo[0].property,
            goodsName: this.state.productInfo[0].title,
            count: this.state.val
          }
        ],
        orderToken: this.props.ordertoken,
        phone: this.props.phone,
        remark: "",
        type: "wx",
        uid: this.props.uid
      };
    
    }
      //获取购买信息
      addOrder(datas).then(res => {
        let _this = this
        let data = res.data.data;
        window.wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: '' + data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.paySign,// 必填，签名
          jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
        });
        // ==== 开始处理初始化配置失败是提示信息 上述操作2 过程
        window.wx.error(function (err) {
          Toast.fail('支付失败,重新尝试', 1)
          _this.props.history.goBack()
        });
        //=== 此处在 config完成初始化配置之后调用支付函数
        window.wx.ready(() => {
          // 调用支付函数
          window.wx.chooseWXPay({
            appId: data.appId, // 可不发
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            success: function (res) {
            
              Toast.success("支付成功", 1)
              _this.props.saveUid(null)
            },
            fail: function (res) {
              // this.props.history.push('/my/cart')
              Toast.fail('支付失败,重新尝试', 1)
              _this.props.history.goBack()

            },
            cancel:function(res){
              Toast.fail('支付失败,重新尝试', 1)
              _this.props.history.goBack()

            }

          })
        }
        )
      }
      )
  }
  // 数量
  onChange = (val) => {
    var totalNum = val
    var totalPrice = val * this.props.payProductinfo[0].wxPrice
    this.setState({
      totalNum,
      totalPrice
    })

    // console.log(val);
    this.setState({ val });
    this.props.Savecount(val, this.props.des)
  }
  // 选择地址或收货地
  checkAddress = () => {

    if (this.props.name !== null) {
      this.props.history.push('/addresslist')
    } else {
      this.props.history.push("/address")
    }
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
        <div style={{ padding: '60px 10px 0' }}>
          <div className="default-address"
            onClick={this.checkAddress}
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
          <div className="order-list">
            {this.props.payProductinfo ? this.props.payProductinfo.map(v => (
              <div key={v.proId} style={{ margin: ".3rem 0" }}>
                <div className="pay-order">
                  <img src={this.props.baseUrl + v.bannerpic} alt="" />
                  <div className="pay-content">
                    <div className="pay-title ellipsis-2">{v.title}</div>
                    {v.property != "" &&
                      <div style={{ color: "#fff", background: '#ccc', display: "inline-block", padding: '.1rem', borderRadius: '.1rem' }}>{v.property}</div>
                    }
                  </div>
                  <div className="pay-price">


                    {this.state.buyType === 2 &&
                      <>
                        <span>&yen;{v.wxPrice}</span>
                        <span style={{ color: '#ccc' }}>x{v.pcount}
                        </span>
                      </>
                    }
                    {this.state.buyType === 1 &&
                      <>
                        <span>&yen;{this.state.totalPrice}</span>
                        <span style={{ color: '#ccc' }}>x{this.state.val}</span>
                      </>
                    }
                  </div>
                </div>


                <div className='buyInfo'>
                  <Flex
                    justify='between'
                  >
                    <div>购买数量</div>
                    {
                      this.state.buyType === 1 && <div>
                        <Stepper
                          style={{ width: '100%', minWidth: '100px' }}
                          showNumber
                          min={1}
                          value={this.state.val}
                          onChange={this.onChange}
                        />

                      </div>
                    }
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
                      <input className='xieshang' placeholder='选填，请先和商家协商一致'></input>
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
            共{this.state.totalNum}件
                </div>
          <div className="submit-order-footer-center">
            <span>合计：</span>
            <span className="total-price"><span>￥</span> {this.state.totalPrice}</span>
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
    baseUrl: state.baseModule.baseUrl,
    ordertoken: state.baseModule.ordertoken,
    count: state.userModule.count,
    des: state.userModule.des,
    payProductinfo: state.CartModule.payProductinfo,
    uid:state.userModule.uid
  }
}

const mapActionToProps = (dispatch) => {
  return {
    //  address to props
    SaveAddressInfo: (name, phone, address) => {
      dispatch({ type: 'SAVE_ADDRESS_INFO', payload: { name, phone, address } })
    },

    // buy count 
    Savecount: (count, des) => {

      dispatch({ type: 'BUY_PRODUCT', payload: { count, des } })
    },
    //  pay success set uid is null
    saveUid :(uid) => {
      dispatch({type:"SAVE_UID",payload:{uid}})
    }
  }
}
export default connect(mapStateToProps, mapActionToProps)(withRouter(Pay))
