import React, { Component } from 'react'
import { CURRENT_USER } from '../../constants'

import './Login.css'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Row, Col, Form, Icon, Input, Button, Card } from 'antd';
const FormItem = Form.Item

const tabList = [{key:'login', tab:'Login'}, {key:'register', tab:'Register'}]

const LoginForm = Form.create({
  mapPropsToFields(props) {
    return {
      email: Form.createFormField({
        ...props.email,
        value: props.email.value,
      }),
      password: Form.createFormField({
        ...props.password,
        value: props.password.value,
      })
    };
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <span>
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
    </span>
  )
})

const RegisterForm = Form.create({
  mapPropsToFields(props) {
    return {
      username: Form.createFormField({
        ...props.username,
        value: props.username.value,
      }),
      firstName: Form.createFormField({
        ...props.firstName,
        value: props.firstName.value,
      }),
      lastName: Form.createFormField({
        ...props.lastName,
        value: props.lastName.value,
      }),
      email: Form.createFormField({
        ...props.email,
        value: props.email.value,
      }),
      password: Form.createFormField({
        ...props.password,
        value: props.password.value,
      })
    };
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
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
    </span>
  )
})

class Login extends Component {
  state = {
    login: true,
    email: {
       value: ''
    },
    password: {
      value: ''
    },
    username: {
      value: ''
    },
    firstName: {
      value: ''
    },
    lastName: {
      value: ''
    },
  }
  toggleState = () => {
    this.setState({login: !this.state.login})
  }
  onSubmit = () => {
    this.form.validateFields((err, values) => {
      if (err) return;
      console.log(values);
      this._confirm(values)
    })
  }
  render() {
    const fields = this.state
    return (
      <Row style={{height:'100vh', textAlign:'center', backgroundColor:'#0D99FC'}} type='flex' align='middle'>
        <Col lg={9} md={8} sm={4} xs={2}/>
        <Col lg={6} md={8} sm={16} xs={20}>
          <img alt='Edumate logo' style={{width:'200px', margin:'0 0 2em'}} src={require('../../assets/images/logo-full.png')} />
          <Card tabList={tabList} onTabChange={() => {this.toggleState()}}>
          <Form className='auth-form'>
            {this.state.login ? (
              <LoginForm {...fields} ref={(form) => this.form = form} />
            ) : (
              <RegisterForm {...fields} ref={(form) => this.form = form} />
            )}
            <Button size='large' style={{width:'100%'}} type='primary' htmlType='submit' onClick={this.onSubmit}>
              <Icon type={this.state.login ? 'login' : 'form'} />
              {this.state.login ? 'Login' : 'Register'}
            </Button>
          </Form>
          </Card>
        </Col>
        <Col lg={9} md={8} sm={4} xs={2}/>
      </Row>
    )
  }

  _confirm = async (values) => {
    const { username, firstName, lastName, email, password } = values
    console.log(email)
    console.log(password)
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      }).catch((error) => {
        console.log(error)
      })
      this._saveUserData(JSON.stringify(result.data.authenticateUser))
    } else {
      const result = await this.props.signupMutation({
        variables: {
          username,
          firstName,
          lastName,
          email,
          password,
        },
      }).catch((error) => {
        console.log(error)
      })
      this._saveUserData(JSON.stringify(result.data.signupUser))
    }
    this.props.history.push(`/`)
  }

  _saveUserData = (user) => {
    console.log('saving user to local storage:')
    console.log(user)
    localStorage.setItem(CURRENT_USER, user)
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
      id
      username
      email
      firstName
      lastName
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      token
      id
      username
      email
      firstName
      lastName
      imageUrl
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)