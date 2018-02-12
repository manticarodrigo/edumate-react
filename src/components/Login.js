import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Row, Col, Form, Icon, Input, Button, Card, Radio } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tabList = [{key:'login', tab:'LOGIN'}, {key:'register', tab:'REGISTER'}]
const contentList = {login: this.LoginForm, register: this.RegisterForm}

class Login extends Component {
  state = {
    login: true,
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  }
  onTabChange = (key) => {
    console.log(key);
    this.state.login = !this.state.login;
  }
  render() {
    return (
      <Row style={{height:'100vh', textAlign:'center', backgroundColor:'#0D99FC'}} type='flex' align='middle'>
        <Col span={8}>col-8</Col>
        <Col span={8}>
          <img style={{width:'200px', margin:'0 0 2em'}} src={require('../assets/images/logo-full.png')} />
          <Card tabList={tabList} onTabChange={(key) => {this.onTabChange(key)}}>
            {!this.state.login ? (
              <Form className='login-form'>
                <FormItem>
                  <Input value={this.state.username} prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username / Email Address' />
                </FormItem>
                <FormItem>
                  <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
                </FormItem>
                <FormItem>
                  <Button type='primary' htmlType='submit' className='login-form-button'>
                    Log in
                  </Button>
                </FormItem>
                <FormItem>
                  <a className='login-form-forgot' href='/forgot'>Forgot password?</a>
                </FormItem>
              </Form>
            ) : ( 
              <div className='flex flex-column'>
                {!this.state.login && (
                  <div>
                    <input
                      value={this.state.username}
                      onChange={e => this.setState({ username: e.target.value })}
                      type='text'
                      placeholder='Your username'
                    />
                    <input
                      value={this.state.firstName}
                      onChange={e => this.setState({ firstName: e.target.value })}
                      type='text'
                      placeholder='Your first name'
                    />
                    <input
                      value={this.state.lastName}
                      onChange={e => this.setState({ lastName: e.target.value })}
                      type='text'
                      placeholder='Your last name'
                    />
                  </div>
                )}
                <input
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
                  type='text'
                  placeholder='Your email address'
                />
                <input
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                  type='password'
                  placeholder='Your password'
                />
                <div className='pointer mr2 button' onClick={() => this._confirm()}>
                  {this.state.login ? 'login' : 'create account'}
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col span={8}>col-8</Col>
      </Row>
    )
  }

  toggleState = () => {
    this.state.login = !this.state.login
  }

  _confirm = async () => {
    const { username, firstName, lastName, email, password } = this.state
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })
      console.log(result)
      const { token } = result.data.authenticateUser.token
      this._saveUserData(token)
    } else {
      const result = await this.props.signupMutation({
        variables: {
          username,
          firstName,
          lastName,
          email,
          password,
        },
      })
      const { token } = result.data.signupUser.token
      this._saveUserData(token)
    }
    this.props.history.push(`/`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!,
    $password: String!,
    $username: String!,
    $firstName: String!,
    $lastName: String!) {
    signupUser(
      email: $email,
      password: $password,
      username: $username,
      firstName: $firstName,
      lastName: $lastName
    ) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      token
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)