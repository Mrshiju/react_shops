import React, { Component } from 'react'
import { Route, Redirect, withRouter, Fragment } from 'react-router-dom'
import { connect } from 'react-redux'
import { overdueToken,getToken } from '../api/index'
export class PrivateRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flag: true
    }
  }
  componentWillMount() {
    overdueToken().then(res => {
      if (res.data.message === 'error') {
        this.setState({
          flag: true
        })
      } else {
        
        let url = window.location.href
        let code = this.getWxcode(url)
        if( code !== undefined){
           getToken(code).then(res => {
            if(res.data.status== false){
                window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcf68c7fb70f54737&redirect_uri=${encodeURIComponent(window.location.href)}&role_type=1&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect`)
                return false
                
            }
           
            if(res.data.data.token){
              this.props.upTokne(res.data.data.token)
            }
          })
          return false
        }

        window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcf68c7fb70f54737&redirect_uri=${encodeURIComponent(window.location.href)}&role_type=1&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect`)
        this.setState({
          flag: false
        })
      }
    })
  }

  /* get wx code */
  getWxcode = (url) => {
    let result = {},
      reg1 = /([^?=&#]+)=([^?=&#]+)/g,
      reg2 = /#([^?=&#]+)/g;
    url.replace(reg1, (n, x, y) => result[x] = y);
    url.replace(reg2, (n, x) => result['HASH'] = x);
    return result.code;
  }

  render() {
    var Component = this.props.component

    return (
      <React.Fragment>
        {
          console.log(this.state.flag)
        }
        {
          this.state.flag ? <Route render={props => <Component {...props} />} ></Route> :
            console.log(window.location.href)

        }

      </React.Fragment>
    )
  }
}
// 映射函数
const mapStateToProps = state => {
  return {
    loginState: state.userModule.loginState
  }
}
const mapActionToProps = (dispatch) => {
  return {
    upTokne :(token) => {
      dispatch({type:"UPTOKEN",payload:{token:token}})
    }
  }
}

export default connect(mapStateToProps, mapActionToProps)(withRouter(PrivateRoute))
