import React, { Component } from 'react'

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
    // this.props.history.replace(`/`)
  }
  render() {
    // console.log(this.props.option.votes.indexOf(this.props.currentUser.id))
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