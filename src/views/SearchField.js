import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { SearchBar } from 'antd-mobile';
import { searchGoods } from '../api/index'
import {WingBlank} from 'antd-mobile'
import '../style/searchfield.css'
export class SearchField extends Component {
    constructor(props) {
        super(props)

        this.state = {
            suggestData: [],
            height: document.documentElement.clientHeight
        }
    }
    handleSearch = value => {
        console.log('====================================');
        console.log(value);
        console.log('====================================');
        // this.props.history.push('/searchgoods/query=' + value)
        let data = {
            pageNum:1,
            pageSize:12,
            name:value
        }
        searchGoods(data).then(res => {
            console.log('====================================');
            console.log(res);
            console.log('====================================');
            res.data.data.list.forEach(item => {
                item.bannerpic = item.bannerpic.split(',')[0]
            });
            this.setState({
                suggestData:res.data.data.list
            })
        })
    }
    // 搜索建议
    handleSearchSuggest = value => {
       
      
    }
    // 点击搜索建议跳转到商品列表页面    
    handleSearchSimilar = cid => {
        this.props.history.push(`/goodsdetail${cid}`)
    }
    componentDidMount() {
        // 自动聚焦
        this.autoFocusInst.focus();
    }
    render() {
        return (
            <div style={{ height: '100%', backgroundColor: '#efeff4'}}>
                <div style={{display: 'flex'}}>
                    <i className="iconfont icon-arrow-left" 
                    style={{width: 30, alignSelf: 'center',  padding: '0 10px'}}
                    onClick={() => this.props.history.push('/')}
                    ></i>
                    <SearchBar placeholder="请输入商品"
                    style={{flex: 1}}
                    onCancel={v => this.handleSearch(v)}
                    onSubmit={v => this.handleSearch(v)}
                    ref={ref => this.autoFocusInst = ref}
                    cancelText="搜索"
                    onChange={v => {
                        // 中文输入法下输入时会出现先英文，如n'i'h'a'o => 你好，中间会有'的标点，
                        // 通过判断是否带有此符号来判断是否继续获取搜索建议
                        if (v.indexOf("'") === -1) {
                            this.handleSearchSuggest(v)
                        }
                    }}
                />
                </div>
                <WingBlank>
                    <ul className="suggest-list">
                        {this.state.suggestData.map(v => (
                            // 点击搜索建议跳转到商品列表页面
                            <li key={v.id} onClick={() => this.handleSearchSimilar(v.id)}>
                                <span className="left">{v.title}...</span> 
                                <span className="right">↖</span>
                            </li>
                        ))}
                    </ul>
                </WingBlank>
            </div>
        )
    }
}

export default withRouter(SearchField)
