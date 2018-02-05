import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  }

  render() {
    return (
      <div>
        <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!this.state.login && (
            <div>
              <input
                value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })}
                type="text"
                placeholder="Your username"
              />
              <input
                value={this.state.firstName}
                onChange={e => this.setState({ firstName: e.target.value })}
                type="text"
                placeholder="Your first name"
              />
              <input
                value={this.state.lastName}
                onChange={e => this.setState({ lastName: e.target.value })}
                type="text"
                placeholder="Your last name"
              />
            </div>
          )}
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Your password"
          />
        </div>
        <div className="flex mt3">
          <div className="pointer mr2 button" onClick={() => this._confirm()}>
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login
              ? 'need to create an account?'
              : 'already have an account?'}
          </div>
        </div>
      </div>
    )
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