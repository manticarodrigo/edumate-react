import React, { Component } from 'react'

import { Spin, Icon } from 'antd'

class Loading extends Component {
  render() {
    const spinnerIcon = <Icon type='loading' style={{ fontSize: 24, color: '#fff', display: 'block' }} spin />
    return (
      <div className='loading-container'>
        <div className='loading-content'>
          <img alt='Edumate logo' style={{width:'200px', margin:'0 0 2em auto', display: 'block' }} src={require('../../assets/images/logo-full.png')} />
          <Spin indicator={spinnerIcon}/>
        </div>
      </div>
    )
  }
}
export default (Loading)