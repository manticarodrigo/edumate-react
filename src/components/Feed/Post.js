import React, { Component } from 'react'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate, timeLeftForDate } from '../../utils'

import { Card, List, Checkbox, Icon, Avatar, Modal } from 'antd'
const { Meta } = Card

class Post extends Component {
  state = {
    modalVisible: false,
    modalImg: ''
  }
  showModal = (imageUrl) => {
    this.setState({
      modalVisible: true,
      modalImg: imageUrl
    })
  }
  handleOk = (e) => {
    this.setState({
      modalVisible: false,
    })
  }
  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
    })
  }
  onCheckboxChange = (e) => {
    const optionId = this.props.option.id
    this.props.voteMutation({
      variables: {
        optionId
      }
    })
    // this.props.history.replace(`/`)
  }
  render() {
    const post = this.props.post
    return (
      <div>
        <Card
          loading={this.props.feedQuery.loading}
          className='post-card'
          actions={[<div><Icon type='like-o' /> Like</div>, <div><Icon type='form' /> Comment</div>, <div><Icon type='export' /> Share</div>]}
        >
          <Meta
            avatar={<Avatar src={post.author.imageUrl ? post.author.imageUrl : require('../../assets/images/user-placeholder.png')} />}
            title={<span>{post.author.firstName} {post.author.lastName}</span>}
            description={timeDifferenceForDate(post.createdAt)}
          />
          {post.text}
          {post.images.map(image => 
            <Card
              key={image.id}
              hoverable='true'
              className='post-img'
              cover={<img style={{padding:'5px'}} alt='post attachment' src={image.url}/>}
              onClick={() => this.showModal(image.url)}
            /> 
          )}
          {post.poll && 
            this._renderPoll(post.poll)
          }
        </Card>
        <Modal
          className='modal-img'
          title='Post Attachment'
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <img alt='post attachment' src={this.state.modalImg} />
        </Modal>
      </div>
    )
  }

  _renderPoll(poll) {
    const currentUser = this.props.currentUser
    var match = null
    var totalVotes = 0
    poll.options.forEach(option => {
      totalVotes += option.votes.length
      const result = currentUser.votesCasted.filter(function( vote ) {
        return vote.option.id === option.id
      })
      match = result[0] ? result[0] : match
    })
    return (
      <Card 
        className='post-poll'
        actions={[<span className='info'><strong>{totalVotes}</strong> votes</span>, <span>{poll.endDate ? timeLeftForDate(poll.endDate) : 'Ongoing'}</span>]}
      >
        <List
          size='small'
          dataSource={poll.options}
          renderItem={option => (
            <List.Item className='option' actions={[ (match ? (match.option.id === option.id ? <Checkbox checked disabled /> : null) : <Checkbox onChange={this.onCheckboxChange} />) ]}>
              <span className='percentage' style={{ width: (option.votes.length/totalVotes)*100 + '%'}} />
              <span className='name'>{option.name} <strong>({(option.votes.length/totalVotes)*100 + '%'})</strong></span>
            </List.Item>
          )}
        />
      </Card>
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

export default graphql(VOTE_MUTATION, { name: 'voteMutation' }) (Post)