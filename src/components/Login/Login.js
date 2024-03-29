import React, { Component } from 'react'

import './Login.css'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Row, Col, Form, Alert, Icon, Input, Button, Card } from 'antd'
const FormItem = Form.Item

const tabList = [{
  key:'login',
  tab:'Login'
  }, {
  key:'register',
  tab:'Register'
}]

class Login extends Component {
  state = {
    tabKey: 'login',
    error: ''
  }
  // toggleState = () => {
  //   this.setState({login: !this.state.login, error: ''})
  // }
  onTabChange = (key) => {
    this.setState({ tabKey: key, error: '' })
  }
  onSubmit = () => {
    this.props.form.validateFields((error, values) => {
      if (error) return
      this._confirm(values)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Row style={{height:'100vh', textAlign:'center', backgroundColor:'#0D99FC'}} type='flex' align='middle'>
        <Col lg={9} md={8} sm={4} xs={2}/>
        <Col lg={6} md={8} sm={16} xs={20}>
          <img alt='Edumate logo' style={{width:'200px', margin:'0 0 2em'}} src={require('../../assets/images/logo-full.png')} />
          <Card
            tabList={tabList}
            activeTabKey={this.state.tabKey}
            onTabChange={(key) => {this.onTabChange(key)}}
          >
            <Form className='auth-form'>
              {this.state.tabKey === 'register' && (
                <span>
                  <FormItem>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: 'Username is required!' }],
                    })(
                      <Input
                        name='username'
                        type='text'
                        placeholder='Username'
                        prefix={<Icon type='eye-o' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('firstName', {
                      rules: [{ required: true, message: 'First name is required!' }],
                    })(
                      <Input
                        name='firstName'
                        type='text'
                        placeholder='First name'
                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('lastName', {
                      rules: [{ required: true, message: 'Last name is required!' }],
                    })(
                      <Input
                        name='lastName'
                        type='text'
                        placeholder='Last name'
                        prefix={<Icon type='team' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    )}
                  </FormItem>
                </span>
              )}
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Email is required!' }],
                })(
                  <Input
                    name='email'
                    type='text'
                    placeholder='Email address'
                    prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Password is required!' }],
                })(
                  <Input
                    name='password'
                    type='password'
                    placeholder='Password'
                    prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </FormItem>
              <Button size='large' style={{width:'100%'}} type='primary' htmlType='submit' onClick={this.onSubmit}>
                <Icon type={this.state.login ? 'login' : 'form'} />
                {this.state.login ? 'Login' : 'Register'}
              </Button>
              {this.state.error && (
                <Alert
                  style={{marginTop:'1em'}}
                  message={this.state.error}
                  type="error"
                  showIcon
                />
              )}
            </Form>
          </Card>
        </Col>
        <Col lg={9} md={8} sm={4} xs={2}/>
      </Row>
    )
  }

  _confirm = async (values) => {
    const { username, firstName, lastName, email, password } = values
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      }).catch(error => {
        console.log(JSON.parse(JSON.stringify(error)))
        const message = error.graphQLErrors[0].message
        this.setState({
          error: message
        })
      })
      if (result) {
        this._saveAuthToken(result.data.login.token)
      }
    } else {
      const result = await this.props.registerMutation({
        variables: {
          username,
          firstName,
          lastName,
          email,
          password,
        },
      }).catch(error => {
        console.log(JSON.parse(JSON.stringify(error)))
        const message = error.graphQLErrors[0].message
        this.setState({
          error: message
        })
      })
      if (result) {
        this._saveAuthToken(result.data.register.token)
      }
    }
  }

  _saveAuthToken = (token) => {
    console.log('saving token to local storage:')
    console.log(token)
    localStorage.setItem('authToken', token)
    window.location.reload()
  }
}

const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $email: String!,
    $password: String!,
    $username: String!,
    $firstName: String!,
    $lastName: String!) {
    register(
      email: $email,
      password: $password,
      username: $username,
      firstName: $firstName,
      lastName: $lastName
    ) {
      token
      user {
        id
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`
const WrappedLogin = Form.create()(Login)
export default compose(
  graphql(REGISTER_MUTATION, { name: 'registerMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(WrappedLogin)