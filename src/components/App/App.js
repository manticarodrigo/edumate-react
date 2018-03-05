import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { CURRENT_USER } from '../../constants'

import './App.css'

import NavMenu from './NavMenu'
import SiderMenu from './SiderMenu'
import Login from '../Login/Login'
import Feed from '../Feed/Feed'
import CourseList from '../CourseList'
import Schedule from '../Schedule'

import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;

class App extends Component {
  state = {
    collapsed: false
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    // localStorage.clear()
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
    console.log('currentUser:')
    console.log(currentUser)
    return (
      <div className='app-container'>
        {currentUser ? (
          <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              className='sider'
            >
              <SiderMenu />
            </Sider>
            <Layout>
              <Header className='navmenu'>
                <NavMenu action={this.toggle} state={this.state} />
              </Header>
              <Content className='main-content'>
                <Switch>
                  <Route exact path='/' component={Feed} />
                  <Route exact path='/courses' component={CourseList} />
                  <Route exact path='/schedule' component={Schedule} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Content>
            <Route exact path='/' component={Login} />
          </Content>
        )}
      </div>
    )
  }
}

export default App