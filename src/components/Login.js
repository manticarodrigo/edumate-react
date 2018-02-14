import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Row, Col, Form, Icon, Input, Button, Card, Radio } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tabList = [{key:'login', tab:'Login'}, {key:'register', tab:'Register'}]
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
  render() {
    return (
      <Row style={{height:'100vh', textAlign:'center', backgroundColor:'#0D99FC'}} type='flex' align='middle'>
        <Col span={8}>col-8</Col>
        <Col span={8}>
          <img style={{width:'200px', margin:'0 0 2em'}} src={require('../assets/images/logo-full.png')} />
          <Card tabList={tabList} onTabChange={() => {this.toggleState()}}>
            <Form className='auth-form'>
              <FormItem>
                {!this.state.login && (
                  <div>
                    <Input
                      value={this.state.username}
                      onChange={e => this.setState({ username: e.target.value })}
                      type='text'
                      placeholder='Username'
                      prefix={<Icon type='smile-o' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                    <Input
                      value={this.state.firstName}
                      onChange={e => this.setState({ firstName: e.target.value })}
                      type='text'
                      placeholder='First name'
                      prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                    <Input
                      value={this.state.lastName}
                      onChange={e => this.setState({ lastName: e.target.value })}
                      type='text'
                      placeholder='Last name'
                      prefix={<Icon type='team' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </div>
                )}
                <Input
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
                  type='text'
                  placeholder='Email address'
                  prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                <Input
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                  type='password'
                  placeholder='Password'
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </FormItem>
              <FormItem>
                <Button className='auth-form-button' type='primary' htmlType='submit' onClick={() => this._confirm()}>
                  {this.state.login ? 'Login' : 'Register'}
                </Button>
              </FormItem>
              <FormItem>
                <a className='login-form-forgot' href='/forgot'>Forgot password?</a>
              </FormItem>
            </Form>
          </Card>
        </Col>
        <Col span={8}>col-8</Col>
      </Row>
    )
  }

  toggleState = () => {
    this.setState({login: !this.state.login})
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