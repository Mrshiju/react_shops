import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
import './tabNav.css'
export class TabNav  extends Component {
    constructor(props){
        super(props)
    }
    render(){
        
        return(
           <div className='tabNav'>
               <div className="back"><Icon type='left'></Icon></div>
               <div className="title">{this.props.name}</div>
           </div>         
        )
    }
}
