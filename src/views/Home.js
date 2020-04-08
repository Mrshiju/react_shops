import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Carousel, Flex, WingBlank, WhiteSpace, SearchBar, Toast ,Icon} from 'antd-mobile';
import { getHomeGoodslist ,getMoreproducte} from '../api/index'
import qs from 'querystring'
import { connect } from 'react-redux'
import '../style/home.css'
import Layout from '../layout/Layout'
import ContentLoader from 'react-content-loader'
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
export class Home extends Component {
  constructor(props) {
    super(props)
    this.scrollDom = React.createRef();
    this.state = {

      imgHeight: '',
      // 商品列表
      goodsList: [],
      // 底部文字是否显示
      bottom: false,
      // 搜索框预设初值
      placeholderPre: '搜索商品，共999+好物',
      //轮播图
      bannerList: [],
      //商品分类
      productList: [],
      //抢购
      skillList: [],
      //下拉加载更多
      pageNum:5,
      pageSize:10,
      //展示回到顶部
      showTop:false,

      //秒杀点击
      seckillClickShow:true,


    }
  }
  // 在render之前获取数据
  componentWillMount() {
    // 获取商品列表数据
    getHomeGoodslist().then(res => {
      let imgUrl = ['jujiashenghuo.png','fushixiebao.png','meishijiushui.png','gehuqingjie.png','muyinqingzi.png','yundonglvxing.png','shumajiadian.png','quanqiutese.png']
      let productList = res.data.data.info;
      productList.forEach((item,index) => {
        productList[index].imgUrl = imgUrl[index]
        // element.imgUrl = 'yundonglvxing.png'
      });

      let goodsList = res.data.data.recommend;
      goodsList.forEach((item)=>{
        item.bannerpic = item.bannerpic.split(",")[0]
      })
      // 解构赋值
      this.setState({
        bannerList: res.data.data.carousel,
        productList: productList,
        goodsList:res.data.data.recommend,
        skillList:res.data.data.seckill.products
      })

    })

    // 获取当前时间
    let data = new Date();
    if(data.getHours() < 10){
      this.setState({
        seckillClickShow:false
      })
    }
    window.addEventListener("scroll",this.handleScroll)
    
  }
 
  componentWillUnmount(){
    window.removeEventListener("scroll",this.handleScroll)
  }
  /* 滚动加载更多 */
  handleScroll = () => {
    //下面是判断页面滚动到底部的逻辑
    let pageNum = this.state.pageNum;
    let pageSize = this.state.pageSize;
    if(this.scrollDom.scrollTop > 800){
      this.setState({
        showTop:true
      })
    }else{
      this.setState({
        showTop:false
      })
    }
    
    if(this.scrollDom.scrollTop + this.scrollDom.clientHeight >= this.scrollDom.scrollHeight){
      pageNum ++;
      this.setState({
        pageNum
      })
     let reqData = {pageNum : pageNum,pageSize : pageSize}
     this.loadingToast();
     getMoreproducte(reqData).then(res=> {
       console.log(res);
       this.loadingHide()
       if(res.data.data.hasNextPage!=true){
         this.setState({
           bottom:true
         })
        return false
       }
       let moreList = res.data.data.list;
       moreList.forEach((item,index) => {
        item.bannerpic = item.bannerpic.split(",")[0]
       })
      //  this.state.productList.push(moreList)
       this.setState({
        goodsList:[...this.state.goodsList,...moreList]
       })
       
     })
    }
}

  //等待图标
  loadingToast = () => {
    Toast.loading('Loading...', 1, () => {


    });
  }
  loadingHide = () => {
    Toast.hide();
  }
  //添加动画效果
  scrollToTop = ()=> {
    const scrollToTop = setInterval(() => {
      let pos = this.scrollDom.scrollHeight;
      if ( pos > 0 ) {
        this.scrollDom.scrollTo( 0, 0 );
       clearInterval( scrollToTop );

      } else {
       clearInterval( scrollToTop );
      }
    }, 10);
  }
  
  // 找相似
  handleSearchSimilar = cid => {
    this.props.history.push('/searchgoods/' + qs.stringify({ cid }))
  }

  // 秒杀点击
  seckillClick = (v) => {
    if(this.state.seckillClickShow == false){
      Toast.fail('活动时间暂未开始', 1);
      return false;
    }
    this.props.history.push(`/goodsdetail${v.id}`)
  }

  render() {
    return (
      // 轮播图区域
     
      <div className="home" 
        ref={ el =>this.scrollDom = el} 
        onScroll={this.handleScroll}
      >
      {
        !this.state.bannerList&&<Loader></Loader>
      }
        {/* 搜索栏 */}
        {this.props.location.pathname === '/' ?
          <SearchBar placeholder={this.state.placeholderPre}
            onFocus={() => this.props.history.push('/searchfield')}
            className="search-area"
          /> : ''}
        {/* 轮播图 */}
        {<Carousel
          autoplay={true}
          infinite
          style={{ marginTop: 44 }}
          className="lunbo"
        >
          {this.state.bannerList.map(item => (
            <img src={this.props.baseUrl + item.banner} alt="" key={item.id} />
          ))}
        </Carousel>

        }
        {/* 分类 */}
        <div className="catitems">
          {
            this.state.productList.map(item => (
              <div onClick={() => this.props.history.push(`/searchgoods/query=${item.cid}`)} key={item.cid}>
                <img src={require(`../assets/imgs/${item.imgUrl}`)} alt="" />
                <div>
                  {item.name}
                </div>
              </div>
            ))
          }
        </div>

        <WhiteSpace size="sm" />
        {/* 秒杀页面 */}
        <div className="seckill">
          <div className="seckill_nav">
            <Flex
              justify="between"
              wrap="wrap"
            >
              <div>限时抢购</div>
              <div>
                <div></div>
                <div style={{textAlign:'center',alignItems:'center'}} 
                onClick={() => this.props.history.push('/SeckillList')}
                >更多抢购<Icon type="right" style={{verticalAlign:"bottom"}}/></div>
              </div>
            </Flex>
          </div>
          <WhiteSpace size="sm" />
          <div className="seckillList">
            <Flex
              align="center"
            >
              {this.state.skillList.map(v => (
                  <div key={v.id} className="seckillList" 
                   onClick={() => this.seckillClick(v)}
                  >
                    <div className='seckillImg'>
                      <img src={this.props.baseUrl +v.bannerpic} alt='seckill' />
                    </div>
                    <div>
                      <Flex
                        justify="between"
                      >

                        <div style={{color:"red"}}>￥{v.wxPrice}</div>
                        <div style={{textDecoration:"line-through",fontSize:12}}>{v.originalprice}</div>
                      </Flex>
                    </div>
                    <div style={{fontSize:12}}>
                      立减{v.originalprice-v.wxPrice}元
                    </div>
                  </div>
              ))}
            </Flex>
          </div>
        </div>

        {/* 首页商品列表区域 */}
        <div className="goodsList">
            <div className="goods">
              {/* WhiteSpace：上下留白 size表示留白的程度 */}
              <WhiteSpace size="xl" />
              <h2
                style={{textAlign : "center",fontSize:18 }}
              >为你推荐</h2>
              <WhiteSpace size="sm" />
              {/* WingBlank：左右留白 size表示留白的程度 */}
              <WingBlank size="sm">
                {/* 采用flex布局 */}
                <Flex
                  justify="between"
                  wrap="wrap"
                >
                  {this.state.goodsList.map(v => (
                    <div key={v.id} className="good">
                      <div className="good_content"
                        onClick={() => this.props.history.push(`/goodsdetail${v.id}`)}
                      >
                        <div className="img_box">
                          <img src={this.props.baseUrl+v.bannerpic} alt="" />
                        </div>
                        <div className="describe ellipsis-1">{v.title}</div>
                        <Flex
                          justify="between"
                        >
                          <div className="price">&yen;{v.wxPrice}</div>
                          <div
                            style={{fontSize:12,textDecoration:'line-through'}}
                          >{v.originalprice}</div>
                        </Flex>

                      </div>
                      {/* <button
                        className='search-similar'
                        onClick={() => this.handleSearchSimilar(v.id)}
                      >
                        立即购买
                      </button> */}
                    </div>
                  ))}
                </Flex>
              </WingBlank>
            </div>
        </div>
        {/* 根据bottom是否显示底部文字 */}
        {this.state.bottom ? <div className="goods-list-bottom">

          <div className="line">
            <span>我是有底线的~</span>
          </div>

        </div> : ''}

        {/* 底部导航栏 */}
        <div className='bottom_nav'>
         <Layout></Layout>
        </div>

        {/* 回到顶部 */}
        {
          this.state.showTop&&<div className="toTop" onClick={this.scrollToTop}>
            <img src={require("../assets/imgs/goTop.png")} alt="" />   
          </div>
        }
      </div>
    )
  }
}
const mapStateToProps = state => {

  return {
    baseUrl: state.baseModule.baseUrl
  }
}
export default connect(mapStateToProps)(withRouter(Home))
