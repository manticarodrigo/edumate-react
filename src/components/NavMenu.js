import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { Menu, Icon } from 'antd';

class NavMenu extends Component {
  handleClick = (e) => {
    if (e.key === 'trigger') {
      this.props.action()
    }
  }
  render() {
    const { location } = this.props;
    return (
      <Menu
        onClick={this.handleClick}
        defaultSelectedKeys={['/']}
        selectedKeys={[location.pathname]}
        mode="horizontal"
      >
        <Menu.Item key="trigger">
          <Icon
            className="trigger"
            type={this.props.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          />
        </Menu.Item>
        <Menu.Item key="/" >
          <Link to="/">
            <Icon type="home" />
            Feed
          </Link>
        </Menu.Item>
        <Menu.Item key="/courses">
          <Link to="/courses">
          <Icon type="book" />
            Courses
          </Link>
        </Menu.Item>
        <Menu.Item key="/schedule">
          <Link to="/schedule">
            <Icon type="calendar" />
            Schedule
          </Link>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(NavMenu)