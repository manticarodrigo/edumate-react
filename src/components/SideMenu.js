import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { AUTH_TOKEN } from '../constants'

import { Menu, Icon } from 'antd';

class SideMenu extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="sidemenu-content">
        {authToken ? (
          <div className="header">
            <img alt="user profile" src={require('../assets/images/logo.png')} />
            <h4>User Name</h4>
            <p>@username</p>
          </div>
        ) : (
          <div></div>
        )}
        <Menu mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default withRouter(SideMenu)