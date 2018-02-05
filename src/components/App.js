import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import '../styles/App.css'

import NavMenu from './NavMenu'
import SideMenu from './SideMenu'
import Login from './Login'
import Feed from './Feed'
import CourseList from './CourseList'
import Schedule from './Schedule'

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
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          className="sidemenu"
        >
          <SideMenu />
        </Sider>
        <Layout>
          <Header className="navmenu">
            <NavMenu action={this.toggle} state={this.state} />
          </Header>
          <Content className="main-content">
            <Switch>
              <Route exact path="/" component={Feed} />
              <Route exact path="/courses" component={CourseList} />
              <Route exact path="/schedule" component={Schedule} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default App


// {authToken && (
//   <Menu.Item key="courses">
//     <Link to="/courses">
//     <Icon type="appstore" />
//       Courses
//     </Link>
//   </Menu.Item>
// )}
// {authToken ? (
//   <Menu.Item key="logout"
//     onClick={() => {
//       localStorage.removeItem(AUTH_TOKEN)
//       this.props.history.push(`/`)
//     }}
//   >
//     <Icon type="mail" />
//     logout
//   </Menu.Item>
// ) : (
//   <Menu.Item key="login">
//     <Link to="/login">
//       <Icon type="mail" />
//       Login
//     </Link>
//   </Menu.Item>
// )}