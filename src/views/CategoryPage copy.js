import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs, NavBar, Icon, Flex, WingBlank, WhiteSpace, Toast,ListView } from 'antd-mobile'
import { getCategoryPage } from '../api/index'
import '../style/categoryPage.css'
import ContentLoader, { Facebook } from 'react-content-loader'
import { connect } from 'react-redux'

const MyLoader = () => (

  <ContentLoader viewBox="0 0 400 800">
    {/* Only SVG shapes */}
    <rect x="10" y="10" rx="5" ry="5" width="70" height="30" />
    <rect x="90" y="10" rx="5" ry="5" width="70" height="30" />
    <rect x="170" y="10" rx="5" ry="5" width="70" height="30" />
    <rect x="250" y="10" rx="5" ry="5" width="70" height="30" />
    <rect x="330" y="10" rx="5" ry="5" width="70" height="30" />
    <rect x="10" y="50" rx="5" ry="5" width="180" height="260" />
    <rect x="200" y="50" rx="5" ry="5" width="180" height="260" />
    <rect x="10" y="320" rx="5" ry="5" width="180" height="260" />
    <rect x="200" y="320" rx="5" ry="5" width="180" height="260" />

  </ContentLoader>
)
export class CategoryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [],
      categories: [],
      //骨架屏
      showLoading: true,
      threeData: [],
     
      pid: this.props.match.params.productid || 220,
      cid:this.props.match.params.cid || 229
    }
  }



  componentWillMount() {
  
  
    window.addEventListener("scroll", this.handleScroll)
    this.init()
  }

  //等待
  loadingToast = () => {
    Toast.loading('Loading...', 1, () => {

    });
  }
  init = () => {
    getCategoryPage().then((res) => {
      if (res.status == 200) {
        let secondData = [];
        res.data.data.forEach(item => {
          secondData.push(...item.one.two)
        })
        secondData = secondData.filter(item => {
          return item.cid == this.state.pid
        })
        let firstData = res.data.data.filter(item => {
          return item.one.cid == secondData[0].pid
        })
        let data = [];
        firstData[0].one.two.forEach(item => {
          data.push(...item.three)
        })
        data.forEach(item => {
          item.title = item.name
          item.key = `t${item.cid}`
          if (item.products) {
            item.products.forEach(list => {
              let title = list.title.split("】")
              list.title = title.length > 1 ? title[1] : title[0]
            })
          }
        })

        this.setState({
          threeData: data
        })

      }
      let tabs = [];
      res.data.data.map((item, index) => {
        item['one'].two.title = item['one'].two.name
        tabs = tabs.concat(item['one'].two)
      })

      this.setState({
        tabs
      })
    })
  }
  componentDidMount() {
   
    
 }
  handleScroll = () => {
    console.log('====================================');
    console.log(  this.scrollDom.scrollTop,this.scrollDom.clientHeight,this.scrollDom.scrollHeight);
    console.log('====================================');
    if (this.scrollDom.scrollTop + this.scrollDom.clientHeight  >= this.scrollDom.scrollHeight) {
      console.log('====================================');
      console.log(12);
      console.log('====================================');

    }

  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }
  render() {
    const tabs = this.state.threeData;
    return (
      <div style={{height:'100%',overflow:'auto'}}>
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          style={{ zIndex: '99', position: 'fixed', height: '45px', width: "100%" }}
        >商品分类</NavBar>
        <div className="categorypage"   >
          {/* 顶部导航条 */}
          <Tabs tabs={tabs} key={tabs} initialPage={`t${this.state.cid}`} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} style={{ display: "inline-block" }} />}>

            {
              tabs && tabs.map((item, index) => (
                <div className='catepageList' key={item.key} ref={ el =>this.scrollDom = el} onScroll={this.handleScroll}>
                  {
                    item.products != null && item.products.map((item1, index1) => (
                      <div key={index1}
                        onClick={() => this.props.history.push(`/goodsdetail${item1.id}`)}
                      >
                        <div className='img_box'>
                          <img src={this.props.baseUrl + item1.bannerpic} alt=""></img>
                        </div>
                        <p style={{height:'1.4rem',overflow: "hidden",whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>{item1.title}</p>
                        <Flex
                          justify='around'>
                          <div style={{ color: 'red' }}>￥{item1.wxPrice}</div>
                          <div style={{ textDecoration: 'line-through' }}>{item1.originalprice}</div>
                        </Flex>
                      </div>
                    )) 
                  }
                </div>
              ))
            }
          </Tabs>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {

  return {
    baseUrl: state.baseModule.baseUrl
  }
}
export default connect(mapStateToProps)(withRouter(CategoryPage))
