import React, { Component } from 'react'
import { withRouter } from 'react-router'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate, timeLeftForDate } from '../../utils'

import { Card, List, Checkbox, Icon, Avatar, Modal } from 'antd'
const { Meta, Grid } = Card

class Post extends Component {
  state = {
    modalVisible: false,
    modalImage: null
  }
  showModal = (image) => {
    this.setState({
      modalVisible: true,
      modalImage: image
    })
  }
  onCheckboxChange = (e) => {
    const optionId = this.props.option.id
    this.props.voteMutation({
      variables: {
        optionId
      }
    })
    this.props.history.replace(`/`)
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
          {post.images && post.images.length > 0 &&
            <Card 
              className='image-card'
              style={{ width: post.images.length === 1 ? '50%' : '100%' }}
            >
              {post.images.map(image => 
                <Grid
                  key={image.id}
                  className='image-grid'
                  style={{ width: post.images.length === 1 ? '100%' : '50%' }}
                >
                  <img
                    className='post-image'
                    alt={image.filename}
                    src={image.url}
                    onClick={() => this.showModal(image)}
                  />
                </Grid>
              )}
            </Card>
          }
          {post.poll && 
            this._renderPoll(post.poll)
          }
          {this.state.modalVisible &&
            this._renderModal()
          }
        </Card>
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
              <span className='name'>{option.name} <strong>({option.votes.length > 0 ? (option.votes.length/totalVotes)*100 + '%' : '0%'})</strong></span>
            </List.Item>
          )}
        />
      </Card>
    )
  }

  _renderModal() {
    const image = this.state.modalImage
    return (
      <Modal
        className='modal-img'
        title={image.filename}
        visible={this.state.modalVisible}
        onOk={() => this.setState({modalVisible: false, modalImage: null})}
        onCancel={() => this.setState({modalVisible: false, modalImage: null})}
      >
        <img alt={image.filename} src={image.url} />
      </Modal>
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

export default withRouter(graphql(VOTE_MUTATION, { name: 'voteMutation' })(Post))