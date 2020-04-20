import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { WingBlank, Flex, TabBar, Radio ,Grid, Icon } from 'antd-mobile'
import '../style/mynologin.css'
import { getCommis } from '../api/index'
export class MyNoLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commission:'',
      images:"",
      phone:"",
      name:""
    }
  }
  
  componentWillMount() {
    getCommis().then((res) => {
      console.log('====================================');
      console.log(res.data.data.phone);
      console.log('====================================');
      if(res){
        this.setState({
          commission : res.data.data.commission,
          images : res.data.data.images,
          phone : res.data.data.phone,
          name : res.data.data.name
        })
      }
    })
  }
  urlTo = (item,index) => {
    console.log(index,item);
    let url = ''
    this.props.history.push(item.path)
  }
  render() {
    const data =[{path:"/order",icon:<i style={{fontSize:26}} className ='iconfont iconwodedingdan'></i>,text:"我的订单"},
                 {icon:<i style={{fontSize:26}} className ='iconfont icondaipingjia1'></i>,text:"待评价"},
                 {icon:<i style={{fontSize:26}} className ='iconfont iconwodepingjia-'></i>,text:"我的评价"},
                 {icon:<i style={{fontSize:26}} className ='iconfont iconhongbao_huaban'></i>,text:"领红包"},
                 {icon:<i style={{fontSize:26}} className ='iconfont iconjifen'></i>,text:"我的积分"},
                 {path:"/addresslist",icon:<i style={{fontSize:26}} className ='iconfont icondizhiguanli'></i>,text:"地址管理"},
                 {icon:<i style={{fontSize:26}} className ='iconfont iconhuodong'></i>,text:"活动"}]
    return (
      <div className='myOrder'>
        <header>
          <div className="title" style={{zIndex:"9999",width:'100%'}}>个人中心</div>
          <WingBlank style={{ marginTop: '0.53333333333rem' }}>

            <Flex justify="start">
              <div className="avatar">
                <div className="wrapper">
                  {!this.state.images&&<i className="iconfont icon-icontouxiang"></i>}
                  <img src= {this.state.images} alt='' style={{borderRadius:'50%',overflow:"hidden"}}></img>
                </div>
              </div>
              <Flex align="center" wrap='wrap'>
                <div className='myInfo'>
                  <span>{this.state.name}</span>
                  <span>{this.state.phone}</span>
                </div>
              </Flex>

            </Flex>
          </WingBlank>
        </header>
        <div className="my-order">我的资产</div>
        <div className='my_orderInfo'>
          <Flex>
            <div>
              <span>{this.state.commission}</span>
              <span>回馈金</span>
            </div>
            <div>
              <span>0</span>
              <span>红包</span>
            </div>
            <div>
              <span>0</span>
              <span>优惠券</span>

            </div>
            <div>
              <span>0</span>
              <span>津贴</span>
            </div>
            <div>
              <span>0</span>
              <span>礼品卡</span>

            </div>
          </Flex>
        </div>

        <Grid data={data} columnNum={3} onClick={this.urlTo} />

       

      </div>
    )
  }
}

export default withRouter(MyNoLogin)
