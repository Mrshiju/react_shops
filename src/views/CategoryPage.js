import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs, NavBar, Icon, Flex, WingBlank, WhiteSpace, Toast,ListView } from 'antd-mobile'
import { getCategoryPage, classMore } from '../api/index'
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
      cid:this.props.match.params.cid || 229,
      pageNum:2,
      pageSize:6
    }
  }



  componentWillMount() {
  
    this.init()
    window.addEventListener("touchmove", this.handleScroll1)
  
  }

  //等待
  loadingToast = () => {
    Toast.loading('Loading...', 1, () => {

    });
  }
  // 关闭等待

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
  handleScroll1 = (i,cid,pgNum) => e => {
    
    let pageNum = pgNum || this.state.pageNum;
   
    if (this[`scrollDom${i}`].scrollTop + this[`scrollDom${i}`].clientHeight  >= this[`scrollDom${i}`].scrollHeight) {
     
      let data = {
        pageSize:this.state.pageSize,
        pageNum:pageNum,
        cid:cid
      }
      if(pgNum == 0){
        return false
      }
      Toast.loading('Loading...', 1, () => {});
      classMore(data).then(res => {
       
        Toast.hide();
        if(res.data.data.list){
          res.data.data.list.forEach(list => {
            let title = list.title.split("】")
            list.title = title.length>1?title[1]:title[0]
            let bannerpic = list.bannerpic.split(',')[0]
            list.bannerpic = bannerpic
          })
        }
        let dataList = this.state.threeData
        let data = dataList.filter(function(item){
          return item.cid == cid
        })
        let dataUp = [...data[0].products,...res.data.data.list];
        data[0].products = dataUp;
        data[0].pageNum = res.data.data.nextPage;
        this.setState({
          threeData: dataList
        })
      })
    }

  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll1)
  }
  render() {
    const tabs = this.state.threeData;
    return (
      <div >
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          style={{ zIndex: '99', position: 'fixed', height: '45px', width: "100%" }}
        >商品分类</NavBar>
        <div className="categorypage">
          {/* 顶部导航条 */}
          <Tabs tabs={tabs} key={tabs} initialPage={`t${this.state.cid}`} distanceToChangeTab={0.6} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} style={{ display: "inline-block" }} />}>

            {tabs && tabs.map((item, index) => (
                <div className={`catepageList catepageList${item.key}`} style={{height:"100%"}} key={item.key} ref={ el =>this[`scrollDom${index}`] = el} onScroll={this.handleScroll1(index,item.cid,item.pageNum)}>
                  {
                    item.products != null ? item.products.map((item1, index1) => (
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
                    )):(<div style={{height:'98%',width:'100%',boxSizing:"border-box",margin:'0',textAlign:'center'}}>
                      暂无商品
                    </div>) 
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
