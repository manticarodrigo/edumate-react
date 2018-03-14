import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { Menu, Popover, Button, Icon } from 'antd'
const MenuItem = Menu.Item

class SiderMenu extends Component {
  state = {
    settingsVisible: false,
  }
  hideSettings = () => {
    this.setState({
      settingsVisible: false,
    });
  }
  handleSettingsVisibleChange = (settingsVisible) => {
    this.setState({ settingsVisible });
  }
  render() {
    const currentUser = this.props.currentUser
    const settingsMenu = (
      <Menu className='settings-menu' mode='inline' inlineCollapsed={false}>
        <MenuItem>
          <span key='logout' onClick={() => {
            // remove token from local storage and reload page to reset apollo client
            localStorage.removeItem('authToken')
            window.location.reload()
          }}>
            <Icon type='logout' />
            <span> Logout</span>
          </span>
        </MenuItem>
      </Menu>
    )
    return (
      <div className='sider-menu'>
        {currentUser && (
          <div className='header'>
            <div className='top'>
              <div className='uncollapsed'>
                <img alt='user profile' src={currentUser.image ? currentUser.image.url : require('../../assets/images/user-placeholder.png')} />
              </div>
              <div className='float-right'>
                <Popover
                  placement='bottomLeft'
                  title='Settings'
                  content={settingsMenu}
                  trigger='click'
                  visible={this.state.settingsVisible}
                  onVisibleChange={this.handleSettingsVisibleChange}
                >
                  <div className='collapsed'>
                    <a>
                      <img alt='user profile' src={currentUser.image ? currentUser.image.url : require('../../assets/images/user-placeholder.png')} />
                    </a>
                  </div>
                  <div className='uncollapsed'>
                    <Button shape='circle' icon='setting' />
                  </div>
                </Popover>
              </div>
            </div>
            <div className='bottom'>
              <h4>{currentUser.firstName} {currentUser.lastName}</h4>
              <p>@{currentUser.username}</p>
            </div>
          </div>
        )}
        <Menu mode='inline' selectable={false}>
          <Menu.Divider />
          <MenuItem key='/profile' >
            <Link to='/profile'>
              <Icon type='user' />
              <span>Profile</span>
            </Link>
          </MenuItem>
          <MenuItem key='/notifications'>
            <Link to='/notifications'>
              <Icon type='notification' />
              <span>Notifications</span>
            </Link>
          </MenuItem>
          <MenuItem key='/messages'>
            <Link to='/messages'>
              <Icon type='message' />
              <span>Messages</span>
            </Link>
          </MenuItem>
          <MenuItem key='/grades'>
            <Link to='/grades'>
              <Icon type='area-chart' />
              <span>Grades</span>
            </Link>
          </MenuItem>
          <Menu.Divider />
          <MenuItem>
            <Link to='/help'>
              <Icon type='question-circle-o' />
              <span>Help</span>
            </Link>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withRouter(SiderMenu)