import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { CURRENT_USER } from '../../constants'

import { Menu, Popover, Button, Icon } from 'antd'
const MenuItem = Menu.Item

class SideMenu extends Component {
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
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
    const settingsMenu = (
      <Menu mode='inline' inlineCollapsed={false}>
        <MenuItem>
          <span key='logout' onClick={() => {
            localStorage.removeItem(CURRENT_USER)
            this.props.history.push(`/`)
            console.log('logout pressed')
          }}>
            <Icon type='logout' />
            <span>Logout</span>
          </span>
        </MenuItem>
      </Menu>
    )
    return (
      <div className='sidemenu-content'>
        {currentUser && (
          <div className='header'>
            <div className='top'>
              <div className='uncollapsed'>
                <img alt='user profile' src={currentUser.imageUrl ? currentUser.imageUrl : require('../../assets/images/user-placeholder.png')} />
              </div>
              <div className='float-right'>
                <Popover
                  placement='bottomRight'
                  title='Settings'
                  content={settingsMenu}
                  trigger='click'
                  visible={this.state.settingsVisible}
                  onVisibleChange={this.handleSettingsVisibleChange}
                >
                  <div className='collapsed'>
                    <img alt='user profile' src={currentUser.imageUrl ? currentUser.imageUrl : require('../../assets/images/user-placeholder.png')} />
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

export default withRouter(SideMenu)