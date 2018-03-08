import React, { Component } from 'react'
import { CURRENT_USER } from '../../constants'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Checkbox } from 'antd';

class VoteCheckbox extends Component {
  onChange = (e) => {
    const optionId = this.props.option.id
    this.props.voteMutation({
      variables: {
        optionId
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
  mutation VoteMutation($optionId: ID!) {
    createVote(
      optionId: $optionId
    ) {
      id
    }
  }
`

export default graphql(VOTE_MUTATION, { name: 'voteMutation' }) (VoteCheckbox)