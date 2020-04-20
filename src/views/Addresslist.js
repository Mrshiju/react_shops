import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NoticeBar, SwipeAction, NavBar, Icon, Toast, Flex, Button, WhiteSpace, Picker, Modal } from 'antd-mobile';
import { withRouter } from 'react-router-dom'
import { createForm } from 'rc-form';
import { showAddressList, deletAdress, upAddress } from '../api/index'
import '../style/addressList.css'
import { Address } from '../components/adress/adress'
const alert = Modal.alert;
export class AddressList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      addressList: [],
      modal2: false,
      name: "",
      phone: '',
      address: "",
      checked: false,
      addressid: ''    //选中修改id      
    }
  }


  componentWillMount() {
    this.getList();

  }
  //获取地址
  getList = () => {
    showAddressList().then((res) => {

      if (res) {
        this.setState({
          addressList: res.data.data
        })
      }

      let address = this.state.addressList;
      if (address.length == 0) {
        this.props.SaveAddressInfo(null, null, null)
      } else {

        address.forEach(item => {
          if (item.status == 1) {
            this.props.SaveAddressInfo(item.name, item.phone, item.address)
          } else {
            this.props.SaveAddressInfo(address[0].name, address[0].phone, address[0].address)
          }
        })
      }
    })
  }
  handleDeleteSingleGoods = (addressid) => {
    deletAdress(addressid).then(res => {

      if (res.data.status == true) {
        Toast.info('删除成功', 1);
        this.getList()
      }
    })
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  // phone chenge
  phoneChange = (e) => {
    this.setState({
      phone: e
    })
  }
  //  name change
  nameChange = (e) => {

    this.setState({
      name: e
    })
  }

  // address change
  addressChange = (e) => {

    this.setState({
      address: e
    })
  }
  // checked chenge
  checkedChange = () => {
    this.setState({
      checked: !this.state.checked
    })
  }
  //  submit form
  SaveAddressInfo = () => {
    this.props.form.validateFields((error, value) => {
      if (error) {
        Toast.fail('请检查数据是否填写正确', 2)
      } else {
        let address = document.querySelector('.am-list-extra').innerText.split(',').join(' ') + ' ' + this.state.address
        let data = {
          address: address,
          addressid: this.state.addressid,
          name: this.state.name,
          phone: this.state.phone,
          status: this.state.checked ? 1 : 0
        }

        upAddress(data).then(res => {
          if (res.data.status == true) {
            Toast.success("更改成功", 1)
          }
          this.setState({
            modal2: false
          })
          this.getList()
        })
      }
    })

  }
  // if buy check address
  checked = (e, v) => {

    this.props.SaveAddressInfo(v.name, v.phone, v.address)
    this.props.history.goBack()
  }


  //close modal
  close = () => {
    this.setState({
      modal2: false
    })
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
          className="nav-bar-style"
        >
          收货地址管理
        </NavBar>
        <div className='address'>
          <NoticeBar mode="closable" icon={<Icon type="check-circle-o" size="xxs" />}>
            左滑对地址进行编辑
          </NoticeBar>
          {/* 顶部样式 */}
          <div className="addressTop">

          </div>
          {/* 修改地址 */}
          <Modal
            transparent='true'
            visible={this.state.modal2}
            onClose={this.onClose('modal2')}
            animationType="slide-up"
            afterClose={() => { }}
            style={{ width: '90%' }}
          >
            <Address
              name={this.state.name}
              phone={this.state.phone}
              address={this.state.address}
              checked={this.state.checked}
              addressChange={this.addressChange}
              nameChange={this.nameChange}
              phoneChange={this.phoneChange}
              SaveAddressInfo={this.SaveAddressInfo}
              checkedChange={this.checkedChange}
              close={this.close}
              form={this.props.form} history={this.props.history}></Address>

          </Modal>
          {/* address-list */}
          <div className=''>
            {this.state.addressList.map((v, i) => (
              <div key={i} onClick={(e) => { this.checked(e, v) }}>
                <SwipeAction
                  key={i}
                  style={{ marginBottom: '0.13333333rem' }}
                  autoClose
                  right={[
                    {
                      text: '编辑',
                      style: { backgroundColor: '#ddd', color: 'white', fontSize: '14px' },
                      onPress: (e) => {

                        e.preventDefault()
                        e.stopPropagation()
                        this.setState({
                          modal2: true,
                          addressid: v.addressid,
                          name: v.name,
                          phone: v.phone,
                          address: v.address.split(' ')[3],
                          checked: v.status == 1 ? true : false
                        })
                      }
                    },
                    {
                      text: '删除',
                      style: { backgroundColor: '#F4333C', color: 'white', fontSize: '14px' },
                      onPress: (e) => {
                        e.preventDefault()
                        e.stopPropagation()


                        alert('删除该地址', '确定吗?', [
                          {
                            text: '我再想想',
                            style: {
                              backgroundColor: '#777',
                              color: '#fff',
                              fontWeight: 700,

                            }
                          },
                          {
                            text: '删除',
                            style: {
                              backgroundColor: 'rgb(244, 51, 60)',
                              color: '#fff',
                              fontWeight: 700,

                            },
                            onPress: () => this.handleDeleteSingleGoods(v.addressid)
                          },
                        ])
                      }
                    },
                  ]}

                >
                  <div className="address-order">
                    <div className="address-content">
                      <Flex>
                        <div className="address-title ellipsis-2" style={{ width: '2rem' }}>
                          {v.name}
                        </div>
                        <Flex
                          align='start'
                          justify='around'
                          direction='column'
                          style={{ marginLeft: ".6rem" }}
                        >

                          <div>
                            <span>
                              {v.phone}
                            </span>
                          </div>
                          <div className="address-price">
                            <span>{v.address}</span>
                          </div>
                        </Flex>
                      </Flex>
                    </div>
                  </div>
                </SwipeAction>
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={() => this.props.history.push('/address')}
          style={{ color: 'white', background: 'red', fontSize: '18px', padding: '.4rem', textAlign: 'center', position: "fixed", width: '100%', bottom: '0' }}>
          新增收货地址
        </div>
      </div>
    )
  }
}



const mapDispatchToProps = dispatch => {
  return {
    SaveAddressInfo: (name, phone, address) => {
      dispatch({ type: 'SAVE_ADDRESS_INFO', payload: { name, phone, address } })
    }
  }
}

export default connect(null, mapDispatchToProps)(createForm()(withRouter(AddressList)))
