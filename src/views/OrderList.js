import React, { Component } from 'react'
import { Tabs, NavBar, Icon, Card, WingBlank, WhiteSpace, Flex, Button, Toast, Modal } from 'antd-mobile';
import { getOrder, payAling , refund} from '../api/index'
import '../style/orderlist.css'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { delOrder } from '../api/index'

export class OrderList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      count: 0,
      orders: [],
      list: [],
      listDate: [],
    }
  }
  //删除订单
  delOrder = e => {
    let list = [];
    list.push(e)
    delOrder(list).then(res => {
      console.log(res);
      if (res.data.status == true) {
        this.getOrderFun()
      }
    })

  }

  componentWillMount() {
    // render之前获取页面是否有id 如果是提交订单后跳转过来的话没有id，Number之后的NaN
    let id = Number(this.props.location.pathname.split('/').pop())
    if (id) {
      this.setState({ id })
    }
    // 获取订单
    this.getOrderFun()

  }

  getOrderFun = () => {
    getOrder().then(res => {
      let nonPaymentData, waitReceivingData, receivedData, refundData;
      if (res.data.data && res.data.data.length != 0) {
        this.setState({
          count: res.data.data.length,
          list: res.data.data,
          orders: res.data.data
        })
        //filter
        res.data.data = res.data.data.filter(function (item) {
          return item.orderInfo != null
        })


        var result = []
        res.data.data.forEach(element => {
          let payStatus = element.order.payStatus;
          let state;
          let product = {

          };
          switch (payStatus) {
            case 1:
              state = "未付款";
              break;
            case 2:
              if (element.order.buyerStatus == 0) {
                state = "待收货";
              } else if (element.order.buyerStatus == 1) {
                state = "已收货";
              } else if (element.order.buyerStatus == 2) {
                state = "换货";
              } else if (element.order.buyerStatus == 3) {
                state = "退货";
              } else if (element.order.buyerStatus == 4) {
                state = "未发货";
              }
              break;
            case 3:
              state = "线下付款";
              break;
            case 4:
              state = "线下付款已支付";
              break;
            case 5:
              state = "取消交易";
              break;
            case 6:
              state = "退款中";
              break;
            case 7:
              state = "退款成功";
              break;
            default:
              state = "未定义";
          }
          // eslint-disable-next-line no-unused-expressions
          product.createTime = element.order.createTime,
            product.orderAmount = element.order.orderAmount,
            product.payStatus = element.order.payStatus,
            product.buyerStatus = element.order.buyerStatus,
            product.orderNumber = element.order.orderNumber,
            product.state = state,
            product.wxbillNumber = element.order.wxbillNumber,
            product.deliveryMoney = element.order.deliveryMoney,
            product.couponFee = element.order.couponFee,
            product.list = [];
          element.orderInfo.forEach((item) => {
            let totleNum = 0;
            let proList = {};
            totleNum += item.goodsNumber;
            product.totleNum = totleNum;
            proList.bannerPic = item.bannerpic.split(',')[0];
            proList.formatId = item.formatId;
            proList.title = item.goodsName;
            proList.price = item.goodsPrice;
            proList.goodsNumber = item.goodsNumber;
            if (item.des) {
              proList.des = item.des;
            }
            product.list.push(proList)
          })
          result.push(product)
        });
        //待付款
        nonPaymentData = result.filter(item => {
          return item.payStatus == 1
        })
        //待收货
        waitReceivingData = result.filter(item => {
          return item.payStatus == 2 && item.buyerStatus == 0
        })
        //已收货
        receivedData = result.filter(item => {
          return item.payStatus == 2 && item.buyerStatus == 1
        })
        //退款
        refundData = result.filter(item => {
          return item.payStatus == 6 || item.payStatus == 7
        })

        let listDate = []
        listDate.push(result);
        listDate.push(nonPaymentData);
        listDate.push(waitReceivingData);
        listDate.push(receivedData);
        listDate.push(refundData);
        this.setState({
          listDate: listDate
        })
      } else {
        this.setState({
          listDate: [[], [], [], [], [], []]
        })
      }
      // if(res.data.data.length){
      //   this.setState({
      //     count:res.data.data.length,
      //     list:res.data.data,
      //     orders:res.data.data
      //   })
      // }else{
      //   this.setState({
      //     count:0
      //   })
      // }

    })
  }

  // 将时间戳转换为2019-9-12 22:36:35格式
  convertTime = (create_time) => {
    let time = new Date(parseInt(create_time) * 1000)
    let y = time.getFullYear(); //getFullYear方法以四位数字返回年份
    let M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
    let d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
    let h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
    let m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
    let s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
    return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
  }
  //支付
  payAlign = (datas) => {
    payAling(datas).then(res => {
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
        Toast.fail("初始化失败", 1)
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
          },
          fail: function (res) {
            // this.props.history.push('/my/cart')
            Toast.fail('支付失败,重新尝试', 1)
            window.location.hash.replace('/cart')
          }

        })
      }
      )
    }
    )
  }
  //退款
  refund = (orderNumber) => {
    refund(orderNumber).then(res => {
      if(res){
        Toast.success("退款申请成功",1)
      }else{
        Toast.fail('稍后再试',1)
      }
    })
  }
  render() {

    const tabs = [
      { title: '全部订单' },
      { title: '待付款' },
      { title: '待收货' },
      { title: '已收货' },
      { title: '退款' },
    ];
    const alert = Modal.alert;
    const showAlert = (e) => {
      const alertInstance = alert('', '确定删除么?', [
        { text: '取消', onPress: () => { }, style: 'default' },
        { text: '确定', onPress: () => this.delOrder(e) },
      ]);
      setTimeout(() => {
        // 可以调用close方法以在外部close
        console.log('auto close');
        alertInstance.close();
      }, 500000);
    };



    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          className="nav-bar-style"
        >
          我的订单{this.state.count ? `(${this.state.count})` : ''}
        </NavBar>
        <Tabs tabs={tabs} initialPage={this.state.id ? this.state.id : 0} animated={true} useOnPan={false}>
          {
            tabs.map((item, index) => (
              <WingBlank size="sm" key={index}>
                {
                  this.state.listDate.length && this.state.listDate[index].map((item1, index) => (
                    <div key={index} onClick={()=>{this.props.history.push(`/orderinfo${item1.orderNumber}`)}}>
                      <WhiteSpace size="lg" />
                      <Card >
                        <Card.Header
                          title={item1.createTime}
                          extra={<span>{item1.state}</span>}
                        />
                        <Card.Body>
                          {
                            item1.list.map((item2, index2) => (
                              <div key={index2} >
                                <Flex
                                  wrap='nowrap'
                                  justify='between'
                                  style={{ paddingBottom: "1.4rem", boxSizing: 'border-box' }}
                                >
                                  <div style={{ width: '20%', height: '2rem', paddingBottom: "1rem", boxSizing: 'border-box' }}>
                                    <img src={this.props.baseUrl + item2.bannerPic} alt="" style={{ backgroundSize: '100%' }} />
                                  </div>
                                  <div className='buy_info'>
                                    <p>{item2.title}</p>
                                    <p>{item2.des}</p>
                                  </div>
                                  <div>
                                    <p>￥{item2.price}</p>
                                    <p style={{ textAlign: "right" }}>x{item2.goodsNumber}</p>
                                  </div>
                                </Flex>

                              </div>
                            ))
                          }
                          <Flex
                            justify='between'
                            style={{ color: '#ccc' }}>
                            <div>
                              运费:{item1.deliveryMoney}
                            </div>
                            <div>
                              共{item1.totleNum}件商品
                                  </div>
                          </Flex>
                          <Flex
                            justify='between'>
                            <div>
                              优惠:{item1.couponFee}
                            </div>
                            <div>
                              合计:￥{item1.orderAmount}元
                                  </div>
                          </Flex>
                        </Card.Body>
                        <Card.Footer content="" extra={<div className="info_type" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <div onClick={() => showAlert(item1.orderNumber)}>删除订单</div>{item1.payStatus == 1 && <div onClick={() => this.payAlign(item1.orderNumber)}>付款</div>}{item1.payStatus == 2 &&
                            <div onClick={() => this.refund(item1.orderNumber)}>申请退款</div>}{item1.wxbillNumber != null && <div>查看物流</div>}</div>} />
                      </Card>
                    </div>
                  ))

                }
              </WingBlank>
            ))
          }


        </Tabs>
        <style jsx>{`
            :global(.am-tabs) {
                position: fixed;
                top: 45px;
            }
            `}
        </style>
      </div>

    )

  }
}
const mapStateToProps = state => {

  return {
    baseUrl: state.baseModule.baseUrl
  }
}
export default connect(mapStateToProps)(withRouter(OrderList))
