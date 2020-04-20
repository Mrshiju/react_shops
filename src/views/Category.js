import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs, NavBar, Icon, Flex, WingBlank, WhiteSpace } from 'antd-mobile'
import { getCategory } from '../api/index'
import '../style/category.css'
import ContentLoader, { Facebook } from 'react-content-loader'
import { connect } from 'react-redux'

const MyLoader = () => (

  <ContentLoader viewBox="0 0 400 170">
    {/* Only SVG shapes */}
    <rect x="10" y="10" rx="5" ry="5" width="70" height="30" />
    <rect x="10" y="50" rx="5" ry="5" width="70" height="30" />
    <rect x="10" y="90" rx="5" ry="5" width="70" height="30" />
    <rect x="100" y="10" rx="4" ry="4" width="70" height="30" />
    <rect x="100" y="50" rx="3" ry="3" width="70" height="80" />
    <rect x="180" y="50" rx="3" ry="3" width="70" height="80" />
    <rect x="260" y="50" rx="3" ry="3" width="70" height="80" />
  </ContentLoader>
)
const Loader = () => {
  let loader = []
  for (let i = 0; i < 4; i++) {
    loader.push(<ContentLoader viewBox="0 0 400 170" key={i}>
      <rect x="10" y="10" rx="5" ry="5" width="70" height="30" />
      <rect x="10" y="50" rx="5" ry="5" width="70" height="30" />
      <rect x="10" y="90" rx="5" ry="5" width="70" height="30" />
      <rect x="100" y="10" rx="4" ry="4" width="70" height="30" />
      <rect x="100" y="50" rx="3" ry="3" width="70" height="80" />
      <rect x="180" y="50" rx="3" ry="3" width="70" height="80" />
      <rect x="260" y="50" rx="3" ry="3" width="70" height="80" />
    </ContentLoader>)
  }
  return loader
}
export class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      //骨架屏
      showLoading: false
    }
  }



  componentWillMount() {
    // 页面加载前获取分类数据
    // 否则请求接口获取分类数据
    getCategory().then((res) => {
      let list = res.data.data;
      this.setState({
        categories: list
      })

    })

  }

  render() {
    let cates = this.state.categories.map(v => {
      return {
        ...(v.one),
        //由于antd mobile的tabs需要title，故加上
        title: v.one.name
      }
    })

    return (
      <div className="category">
        {
          !cates.length ? <Loader />:

        <Fragment>
          {/* 顶部导航条 */}
          <NavBar
            mode="dark"
            leftContent={<Icon type='left' />}
            onLeftClick={() => this.props.history.goBack()}
            style={{zIndex:'99',position:'fixed',height:'45px',width:"100%"}}
          >商品分类</NavBar>
          <Tabs tabs={cates}
            initalPage={0}
            animated={true}
            tabBarPosition="left"
            tabDirection="vertical"
            useOnPan={true}

            tabBarTextStyle={
              {
                width: 86,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#666',
                fontSize: 12,
              }
            }
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={12} />}
          >

            {
              cates.map((Item, index) => (
                <div className='rightbox' key={index} style={{ width: "100%", height: 'cale(100%-95px)', backgroundColor: '#fff', paddingLeft: '0.1rem' }}>
                  <WhiteSpace type='sm' />
                  {
                    Item['two'].map((item, idx) => (
                      <div className="tabTitle" style={{ width: '100%' }} key={idx}>
                        <WhiteSpace type='sm' />
                        <h4 style={{ fontSize: 18 }}>{item.name}</h4>
                        <Flex
                          wrap='wrap'
                        >
                          {
                            item['three'].map((item, index) => (
                              <div style={{ width: '33%' }} key={index} onClick={ () => this.props.history.push(`/categorypage${item.pid}/${item.cid}`)}>
                                <div className="img" style={{position:'relative',paddingTop:'100%'}}>
                                  <img src={this.props.baseUrl + 'classification' + item.images} alt='' style={{position:'absolute',height:'100%',top:0}}></img>
                                </div>
                                <p style={{ fontSize: 12, textAlign: 'center' }}>{item.name}</p>
                              </div>
                            ))
                          }
                        </Flex>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </Tabs>
          <style jsx>{`
                      .category .am-tabs,.am-tabs-vertical,.am-tabs-left{
                        padding-top :50px
                      }
                     .rightbox .am-tabs {
                        position: fixed !important;
                        top: 45px !important;
                      }
              `}</style>
        </Fragment>
  }
        {/* 顶部导航条 */}
      </div>

    )
  }
}
const mapStateToProps = state => {

  return {
    baseUrl: state.baseModule.baseUrl
  }
}
export default connect(mapStateToProps)(withRouter(Category))
