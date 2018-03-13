import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import './App.css'

import Loading from './Loading'
import NavMenu from './NavMenu'
import SiderMenu from './SiderMenu'
import Login from '../Login/Login'
import Feed from '../Feed/Feed'
import CourseList from '../CourseList'
import Schedule from '../Schedule'

import { Layout } from 'antd'
const { Header, Sider, Content } = Layout

class App extends Component {
  state = {
    siderCollapsed: false
  }

  _toggleSider = () => {
    this.setState({
      siderCollapsed: !this.state.siderCollapsed
    })
  }

  _showLogin = () => {
    this.props.history.replace('/login')
  }

  _isLoggedIn = () => {
    return this.props.authQuery.user && this.props.authQuery.user.id !== null
  }

  render() {
    if (this.props.authQuery && this.props.authQuery.error) {
      console.log('AUTH ERROR:', this.props.authQuery.error)
    }
    
    if (this.props.authQuery && this.props.authQuery.loading) {
        return <Loading/>
    }

    const currentUser = this.props.authQuery.user
    
    return (
      <div>
        {currentUser ? (
          <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.siderCollapsed}
              className='sider'
            >
              <SiderMenu currentUser={currentUser} />
            </Sider>
            <Layout>
              <Header className='navmenu'>
                <NavMenu action={this._toggleSider} state={this.state} />
              </Header>
              <Content className='main-content'>
                <Switch>
                  <Route exact path='/' render={(props)=><Feed {...props} currentUser={currentUser} />} />
                  <Route exact path='/courses' component={CourseList} />
                  <Route exact path='/schedule' component={Schedule} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Content>
            <Login />
          </Content>
        )}
      </div>
    )
  }
}

const AUTH_QUERY = gql`
  query {
    user {
      id
      email
      username
      firstName
      lastName
      imageUrl
      votesCasted {
        id
        option {
          id
        }
      }
    }
  }
`

export default graphql(AUTH_QUERY, {
  name: 'authQuery',
  options: { fetchPolicy: 'network-only' }
})(withRouter(App))