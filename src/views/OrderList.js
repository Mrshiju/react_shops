import React, { Component } from 'react'
import { Tabs, NavBar, Icon, Card, WingBlank, WhiteSpace, Flex ,Button,Toast ,Modal} from 'antd-mobile';
import { getOrder } from '../api/index'
import '../style/orderlist.css'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom' 
import {delOrder} from '../api/index'

export class OrderList extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      count: 0,
      orders: [],
      list:[],
      listDate:[],
    }
  }
 //删除订单
 delOrder = e => {
   let list = [];
   list.push(e)
   delOrder(list).then(res => {
     console.log(res);
     if(res.data.status==true){
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
        let nonPaymentData,waitReceivingData,receivedData,refundData;
        if(res.data.data&&res.data.data.length!=0){
          this.setState({
                count:res.data.data.length,
                list:res.data.data,
                orders:res.data.data
              })
          //filter
          res.data.data = res.data.data.filter(function(item){
            return item.orderInfo != null
          })
          
          
          var result = []
          res.data.data.forEach(element => {
            let payStatus = element.order.payStatus;
            let state;
            let product = {
              
            };
            switch(payStatus){
              case 1:
                state = "未付款";
                break;
              case 2:
                if(element.order.buyerStatus==0){
                  state = "待收货";
                }else if(element.order.buyerStatus==1){
                  state = "已收货";
                }else if(element.order.buyerStatus==2){
                  state = "换货";
                }else if(element.order.buyerStatus==3){
                  state = "退货";
                }else if(element.order.buyerStatus==4){
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
            element.orderInfo.forEach((item)=>{
              let totleNum = 0;
              let proList = {};
              totleNum += item.goodsNumber;
              product.totleNum = totleNum;
              proList.bannerPic = item.bannerpic.split(',')[0];
              proList.formatId  = item.formatId;
              proList.title = item.goodsName;
              proList.price = item.goodsPrice;
              proList.goodsNumber = item.goodsNumber;
              if(item.des){
                proList.des = item.des;
              }
              product.list.push(proList)
            })
            result.push(product)
          });
          //待付款
          nonPaymentData = result.filter(item => {
            return item.payStatus==1
          })
          //待收货
          waitReceivingData = result.filter(item => {
            return item.payStatus==2 && item.buyerStatus==0
          })
          //已收货
          receivedData = result.filter(item => {
            return item.payStatus==2&&item.buyerStatus==1
          })
          //退款
          refundData = result.filter(item => {
            return item.payStatus==6 || item.payStatus==7
          })
          
          let listDate = []
          listDate.push(result);
          listDate.push(nonPaymentData);
          listDate.push(waitReceivingData);
          listDate.push(receivedData);
          listDate.push(refundData);
          this.setState({
            listDate:listDate
          })
        }else{
          this.setState({
            listDate:[[],[],[],[],[],[]]
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
        { text: '取消', onPress: () => {}, style: 'default' },
        { text: '确定', onPress: () => this.delOrder(e)},
      ]);
      setTimeout(() => {
        // 可以调用close方法以在外部close
        console.log('auto close');
        alertInstance.close();
      }, 500000);
    };
    

    console.log(this.state.listDate[0])
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.push('/my')}
          className="nav-bar-style"
        >
          我的订单{this.state.count ? `(${this.state.count})` : ''}
        </NavBar>
        <Tabs tabs={tabs} initialPage={this.state.id ? this.state.id : 0} animated={true} useOnPan={false}>
            {
              tabs.map((item,index)=> (
                <WingBlank size="sm" key={index}>
                 {
                   this.state.listDate.length&&this.state.listDate[index].map((item1,index) => (
                     <div key={index}>
                    <WhiteSpace size="lg"  />
                      <Card >
                        <Card.Header
                          title={item1.createTime}
                          extra={<span>{item1.state}</span>}
                        />
                        <Card.Body>
                          {
                            item1.list.map((item2,index2) => (
                              <div key={index2}>
                                <Flex 
                                wrap = 'nowrap'
                                justify='between'
                                style={{paddingBottom:"1.4rem",boxSizing:'border-box'}}
                              >
                                    <div style={{width:'20%',height:'2rem',paddingBottom:"1rem",boxSizing:'border-box'}}>
                                      <img src={this.props.baseUrl + item2.bannerPic} alt="" style={{backgroundSize:'100%'}}/>
                                    </div>
                                    <div className='buy_info'>
                                      <p>{item2.title}</p>
                                      <p>{item2.des}</p>
                                    </div>
                                    <div>
                                      <p>￥{item2.price}</p>
                                      <p style={{textAlign:"right"}}>x{item2.goodsNumber}</p>
                                    </div>
                                </Flex>
                               
                              </div>
                            ))
                          }
                           <Flex
                                justify='between'
                                style={{color:'#ccc'}}>
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
                        <Card.Footer content="" extra={<div className="info_type" style={{display:'flex',justifyContent:'flex-end'}}>
                          <div onClick={() => showAlert(item1.orderNumber)}>删除订单</div>{item1.payStatus == 1 &&<div>付款</div>}{item1.payStatus == 2&&
                          <div onClick={() => showAlert(item1.orderNumber)}>申请退款</div>}{item1.wxbillNumber != null&&<div>查看物流</div>}</div>} />
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
export default  connect(mapStateToProps)(withRouter(OrderList))
