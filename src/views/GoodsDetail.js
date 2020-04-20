import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getGoodsDetail, addCart, getCartGoods ,wantBuy  } from '../api';
import { NavBar, Carousel, Icon, Badge, WingBlank, WhiteSpace, Toast, Flex, Modal, Tag, Radio,Stepper } from 'antd-mobile';
import '../style/goodsdetail.css'
var data = {};
var propertys = {};
export class GoodsDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: {},
      id:'',
      carouselList: [],
      animating: false,
      display1: 'block',  
      display2: 'none',
      evaluate: [],   //评价
      proImg: [],
      morePro: [],
      goodInfo: [],
      proPropety: {},    //是否需要选属性
      checkedPetyshow: false,    //属性选择框
      propertys: {},
      count: 1,    //数量 
      modal2: false,
      willPropertys: {},
      index:{

      },
      val:1   //数量
    }
  }

  //
  componentWillMount(){
    this.saveUid()
    this.setState({ 
      id:this.props.match.params.id
    })
  }
  // 页面加载后获取数据
  componentDidMount() {
    // 一开始设置等待
    this.setState({ 
      animating: true ,
     
    })
    // 获取商品详情
    getGoodsDetail(this.state.id).then(res => {
      var bannerpic = [...res.data.data.products.bannerpic.split(',')]
      res.data.data.products.buyPic = res.data.data.products.bannerpic.split(',')[0]
      var evaluate = res.data.data.products.customerevaluation.split("#1#")
      var proImg = res.data.data.products.productinfo.split(",")
      var property = JSON.parse(res.data.data.products.productproperty)
      res.data.data.mall.list.map((item,index) => {
        if(item.title.split('】').length > 1){
          item.title = item.title.split('】')[1]
        }
      })

      if (res) {
        this.setState({
          carouselList: bannerpic,
          goodInfo: res.data.data.products,
          evaluate: evaluate,
          proImg: proImg,
          morePro: res.data.data.mall.list,
          willPropertys: property
        })
      }

    })
  }
  //判读是否有属性
  hasClass = (e) => {
    // 产品属性
    let _this = this;
    let result = true;
    // let count = this.state.products.;
    let property = JSON.parse(this.state.goodInfo.productproperty)
    for (let key in property) {
      property[key] = property[key].split(",")
    }


    if (Object.keys(property).length) {
      // this.setData({
      //   flag:true
      // });

      //判断选择属性
    
      if (Object.keys(this.state.propertys).length == 0) {
        Toast.fail('请选择商品属性', 1);
        result = false
      }
      // eslint-disable-next-line no-unused-vars
      
      if (Object.keys(this.state.propertys).length != Object.keys(this.state.willPropertys).length) {
       
        Toast.fail('请选择商品属性', 1);
        result = false
      }else{
        result = true
      }

    } else {
      result = true
    }
    this.setState({
      // count:count
    })
    return result
  }
  // 添加商品到购物车
  addGoodsToCart = () => {
    // 如果已登录，则直接添加到购物车
    let res = this.hasClass()
    if(res == false){
      this.setState({
        modal2:true
      })
      return false
    }
    let products = ''
    for( let key in this.state.propertys){
      products += `|${this.state.propertys[key]}`
    }
    let data = {
      productId:this.state.id,
      property:products.substring(1)
    }
    addCart(data).then(res => {
      if(res.data.status==true){
        Toast.success('添加购物车成功', 1);
      }
    })
  }
  // 跳转到购物车
  jumpCart = () => {
    this.props.history.push('/my/cart')
  }
   /* 判断是否有uid 有存储  下单时携带 */
   saveUid = () => {
    let url = window.location.href
    let uid = this.getUid(url)
    if(uid !== undefined){
      this.props.saveUid(uid)
    }
  }
  /* 获取uid */
  getUid = (url) => {
    let result = {},
      reg1 = /([^?=&#]+)=([^?=&#]+)/g,
      reg2 = /#([^?=&#]+)/g;
    url.replace(reg1, (n, x, y) => result[x] = y);
    url.replace(reg2, (n, x) => result['HASH'] = x);
    return result.uid;
  }
  // 立即购买
  buyNow = () => {
    // 如果已token，则跳转到支付页面
    let res = this.hasClass()
    if(res === false){
      this.setState({
        modal2:true
      })
      return false
    }
    let products = ''
    for(let key in this.state.propertys){
      products += `|${this.state.propertys[key]}`
    }
    
    let proInfo = []
    let info = {
      proId:this.state.id,
      pcount:this.state.count,
      wxPrice:this.state.goodInfo.wxPrice,
      title:this.state.goodInfo.title,
      bannerpic:this.state.goodInfo.bannerpic.split(',')[0],
      property:products.substring(1)
    }
    proInfo.push(info)
    wantBuy().then(res => {
    
      this.props.wantBuys(res.data.data.orderToken)
    })
    this.props.buyNow(this.state.count,products.substring(1))
    this.props.payProductInfo(proInfo)

   
    this.props.history.push(`/pay/${this.state.id}`)

  }
  //选择关闭
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  //选择属性
  select = (e) => {
    console.log(e);

  }
  //
  checked = (e,i,i1) => {
    propertys[i1] = e
    data[i1] = i;
    this.setState({
      index:data,
      propertys:propertys
    })
  }
  // 购买数量
  buyCount = (e) => {

    this.setState({
      count:e
    })
  }
  //猜你喜欢
  moreList = (e) => {
    console.log(e)
    this.setState({
      id:e
    })
    this.props.history.push(`/goodsdetail${e}`)
  }
  componentWillReceiveProps(newProps) {
    this.setState({ 
      animating: true ,
     
    })
    this.setState({
      id:newProps.match.params.id
    })
    // 获取商品详情
    window.location.reload()
    
  }
  render() {
    return (
      <div className='goodsdetail'>

        {/* 顶部导航条 */}
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          className="nav-bar-style"
        >商品详情</NavBar>
        {/* 轮播图区域 */}
        <Carousel
          // 自动轮播
          autoplay={true}
          infinite
          style={{
            marginTop: 45,
            height: '8rem'
          }}
        >

          {this.state.carouselList.map((val, idx) => (
            <div key={idx} style={{ height: '8rem' }}>
              <img
                src={this.props.baseUrl + val}
                alt=""
                style={{ width: '100%', height: '8rem', verticalAlign: 'middle' }}
                // 图片加载完取消等待
                onLoad={() => {
                  this.setState({ animating: false })
                }}
              />
            </div>
          ))}
        </Carousel>
        <div className="good-content">

          <div className="good-price">
            <Flex
              justify='around'>
              <div>
                <span>&yen;</span>{this.state.goodInfo.wxPrice}
              </div>
              <div style={{ color: 'black', textDecoration: 'line-through' }}>
                {this.state.goodInfo.originalprice}
              </div>
            </Flex>
          </div>
          <div className="good-describe" style={{ fontSize: '.5rem', fontWeight: '700' }}>{this.state.goodInfo.title}</div>
        </div>
        <div className="good-select">
          <div className='evaluate'>
            <Flex
              align='center'
              justify="between"
              style={{ fontSize: '.4rem' }}
            >
              <div>宝贝评价</div>
              <div >查看更多<Icon type="right" style={{ verticalAlign: 'bottom' }} /></div>
            </Flex>
          </div>
          {
            this.state.evaluate && this.state.evaluate.map((item, index) => (
              <Flex
                key={index}
                wrap='wrap'
                justify='around'
                style={{ fontSize: '.3rem', padding: '0 0.2rem' }}
              >
                <WhiteSpace size="lg" />

                <WingBlank size='lg' />
                <div style={{ width: '100%', borderTop: '1px solid #ddd' }}>
                  <i className='iconfont icongerenzhongxin'></i>
                  <span>&nbsp;&nbsp;&nbsp;</span>匿名用户
                  </div>
                <div style={{ width: '100%', }}>{item}</div>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
              </Flex>
            ))
          }

          <WhiteSpace />
        </div>
        <WhiteSpace />
        <WhiteSpace />
        {/* 图文详情 */}
        <div className='proInfo'>商品信息</div>
        <div style={{ display: this.state.display1 }} className="goods_info">
          {
            this.state.proImg.map((item, index) => (
              <div key={index}>
                <img src={this.props.baseUrl + item} alt='商品详情' />
              </div>
            ))
          }

        </div>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className='proInfo'>猜你喜欢</div>
        <Flex className='morePro' justify='around' wrap='wrap'>
          {
            this.state.morePro && this.state.morePro.map((item, index) => (
              <div key={index} style={{ width: '50%', height: "6rem", padding: '.2rem', border: "1px solid #ddd" }}  
                onClick={() => this.moreList(item.id)} 
               >
                <div style={{ width: '100%', height: '4rem', textAlign: 'center' }}>
                  <img src={this.props.baseUrl + item.bannerpic} alt='moreList' style={{ width: '100%', height: '100%' }} />
                </div>
                <div>{item.title}</div>
                <Flex
                  justify='between'>
                  <div style={{ color: 'orange' }}>
                    ￥{item.wxPrice}
                  </div>
                  <div style={{ textDecoration: 'line-through' }}>
                    ￥{item.originalprice}
                  </div>
                </Flex>
              </div>
            ))
          }
        </Flex>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        {/* 弹出选择属性 */}
        <Modal
          popup
          visible={this.state.modal2}
          onClose={this.onClose('modal2')}
          animationType="slide-up"
          afterClose={() => { }}
          style={{ paddingBottom: "45px" }}
        >
          <Flex align='start' justify='start' style={{ padding: '0.1rem', borderBottom: "1px solid #ddd" }}>

            <div style={{ width: '2.4rem', height: '2.4rem' }}>
              <img src={this.props.baseUrl + this.state.goodInfo.buyPic} alt="商品图片"></img>
            </div>
            <Flex justify='around' direction='column' align='start' style={{ height: '2rem' }}>
              <p style={{ color: 'red' }}>￥{this.state.goodInfo.wxPrice}</p>
              <span>{this.state.goodInfo.title}</span>
            </Flex>
          </Flex>
          {Object.keys(this.state.willPropertys).length !==0 ? <div className='checkPro'>
            {
              this.state.willPropertys && Object.keys(this.state.willPropertys).map((item, index1) => (
                <div key={index1}>
                  <p style={{ paddingBottom: '.2rem' }}> {item}</p>
                  {
                    this.state.willPropertys[item].split(',').map((item1, index) => (
                      <span key={index} style={{ border: "1px solid #ddd", padding: '.1rem', margin: ' .2rem', borderRadius: '4px',display:"inline-block" }}
                      onClick={() => this.checked(item1,index,index1)}
                      id={index == this.state.index[index1] ? 'active' : ''}
                      > {item1}</span>
                    ))
                  }
                </div>
     
               ))
              }
            </div>
          :''}
          <Flex
          align='center'
          justify='between'
          >
            <div>购买数量</div>
              <Stepper
                style={{ width: '30%', minWidth: '100px' }}
                showNumber
                min={1}
                value={this.state.count}
                onChange={this.buyCount}
              />
          </Flex>
        </Modal>
        {/* 页面底部加入购物车 */}
        <div className="goods-footer" style={{ zIndex: 99999 }}>
          <div className="goods-footer-item contact">
            <span className="iconfont iconkefu1"></span>
            <span>联系客服</span>
          </div>
          <div className="goods-footer-item cart" onClick={() => this.props.history.push('/cart')}>
            <span className="iconfont icongouwuche1"> </span>
            <span>购物车</span>
          </div>
          <div className="goods-footer-item add" onClick={this.addGoodsToCart}>
            <span>加入购物车</span>
          </div>  
          <div className="goods-footer-item buy" onClick={this.buyNow}>
            <span>立即购买</span>
          </div>
        </div>

      </div>

    )
  }
}

// 创建映射状态函数
const mapStateToProps = state => {
  return {
    totalNum: state.CartModule.totalNum,
    loginState: state.userModule.loginState,
    baseUrl: state.baseModule.baseUrl,
  }
}

// 创建映射dispatch函数
const mapDispatchToProps = dispatch => {
  return {
    wantBuys:(ordertoken) => {
      dispatch({ type: 'GET_ORDERTOKEN', payload: { ordertoken } })
    },
    addCart: () => {
      dispatch({ type: 'ADD_CART' })
    },
    buyNow: (count, des) => {
      dispatch({ type: 'BUY_PRODUCT', payload: { count, des } })
    },
    payProductInfo:(payProductinfo)=>{
      dispatch({type:'ADD_PAYPRO', payload :payProductinfo })
    },
    saveUid:(uid) => {
      dispatch({type:'SAVE_UID',payload:{uid}})
    }

   
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoodsDetail))
