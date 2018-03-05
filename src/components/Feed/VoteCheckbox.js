import React, { Component } from 'react'
import { CURRENT_USER } from '../../constants'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Checkbox } from 'antd';

class VoteCheckbox extends Component {
  onChange = (e) => {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
    console.log(e);
    this.props.voteMutation({
      variables: {
        // id: option.id,
        authorId: currentUser.id
      }
    })
    // this.props.history.push(`/`)
  }
  render() {
    return (
      <Checkbox onChange={this.onChange} />
    )
  }
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($authorId: ID!) {
    createVote(
      authorId: $authorId
    ) {
      id
    }
  }
`

export default graphql(VOTE_MUTATION, { name: 'voteMutation' }) (VoteCheckbox)