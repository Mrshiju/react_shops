import React, { Component } from 'react'
import { Tabs, NavBar, Icon, Card, WingBlank, WhiteSpace, Flex ,Button,Toast ,Modal} from 'antd-mobile';
import { getOrder } from '../api/index'
import '../style/seckillList.css'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom' 
import {delOrder,getHomeGoodslist} from '../api/index'

export class SeckillList extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
     
      SeckillList:[],
      click:0,
      listData:[],
      nowDate:"",
      checkDate:'10'
    }
  }
 
  componentWillMount() {
    // 获取现在时间
    const date = new Date();
    let nowDate = date.getHours();
    this.setState({
      nowDate
    })
    getHomeGoodslist().then(res => {
     
      this.setState({
        SeckillList:res.data.data.seckill,
        listData:res.data.data.seckill['10:00']
      })
    })
  }
  // 选择时间点
  checked = (data,index) => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const date = new Date();
    let nowDate = date.getHours();
    
    this.setState({
      nowDate
    })
    let listData = this.state.SeckillList[data];
    listData.forEach(element => {
       
      if(element.title.split("】").length > 1){

        element.title = element.title.split("】")[1]
      }
      element.bannerpic = element.bannerpic.split(",")[0]
    });
    var checkDate = data.split(":")[0]
    this.setState({
      listData,
      checkDate,
      click:index
    })
    console.log('====================================');
    console.log(nowDate,checkDate);
    console.log('====================================');
  }
  
  // 没有开始
  noStart = () => {
    Toast.fail('活动时间还没有开始', 1);
  }
 
  render() {
    
    console.log('====================================');
    console.log(this.state.listData);
    console.log('====================================');
    const topNav = Object.keys(this.state.SeckillList).slice(1)
    
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          className="nav-bar-style"
        >
          限时秒杀
        </NavBar>
        <div className="seckList">
          <div className='top_nav'>
            <Flex
            justify='between'
            align='center'
            >
              {
                topNav.map((item,index)=>(
                  <div className='topNav' id={index == this.state.click &&'seckill_active'} key={index} onClick={() => {this.checked(item,index)}}>
                    {item}
                  </div>
                ))
              }
            </Flex>
          </div>

          <div className='list'>
              {
                this.state.listData.map((item,index) => (
                  <div className='prilist' key={index}>
                   
                      <div className="seckillImg">
                        <img src={this.props.baseUrl + item.bannerpic} alt=''></img>
                      </div>
                      <div className='proInfo'>
                        <p>{item.title}</p>
                        <div>
                          <span style={{color:'red'}}>限时价:￥{item.wxPrice}</span>
                          <span style={{textDecoration:"line-through"}}>{item.originalprice}</span>
                        </div>
                      </div>
                      <div className='subBox' style={{backgroundColor:"#fff",textAlign:'end'}}>
                        {
                          this.state.nowDate >= this.state.checkDate ? <div onClick={() => {this.props.history.push(`/goodsdetail${item.id}`)}}>马上抢</div> : <div
                          onClick  = {this.noStart}
                          >即将开抢</div>
                        }
                      </div>
                  </div>
                ))
              }
          </div>

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
export default  connect(mapStateToProps)(withRouter(SeckillList))
