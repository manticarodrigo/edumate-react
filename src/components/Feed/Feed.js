import React, { Component } from 'react'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate } from '../../utils'

import CreatePost from './CreatePost'
import VoteCheckbox from './VoteCheckbox'

import { List, Card, Checkbox, Icon, Avatar, Spin, Modal, Alert } from 'antd';
const { Meta } = Card;

class Feed extends Component {
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
  render() {
    const currentUser = this.props.currentUser
    const spinnerIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin:'0'}}><Spin indicator={spinnerIcon}/> LOADING</div>
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      console.log(this.props.feedQuery.error)
      return (
        <Alert
          message="ERROR"
          description="There was a problem loading your feed."
          type="error"
          showIcon
          banner
        />
      )
    }
    
    var postsToRender = this.props.feedQuery.feed
    console.log(postsToRender)
    return (
      <div>
        <CreatePost />
        <List
          itemLayout='vertical'
          size='large'
          dataSource={postsToRender}
          renderItem={post => (
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
                <List
                  bordered
                  size='small'
                  className='post-poll'
                  dataSource={post.poll.options}
                  renderItem={option => (
                    <List.Item actions={[ (this._votedInPoll(post.poll) ? (this._votedInPoll(post.poll) == option.id ? <Checkbox checked disabled /> : null) : <VoteCheckbox option={option} />) ]}>
                      {option.name}
                    </List.Item>
                  )}
                />
              }
            </Card>
          )}
        />
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

  _votedInPoll(poll) {
    const currentUser = this.props.currentUser
    var match = null
    poll.options.map(option => {
      currentUser.votesCasted.filter(function( vote ) {
        if (vote.option.id === option.id) {
          match = option.id
        }
      })
    })
    return match ? match : null
  }
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      createdAt
      author {
        id
        firstName
        lastName
        imageUrl
      }
      text
      images {
        id
        url
      }
      poll {
        options {
          id
          name
          votes {
            user {
              id
            }
          }
        }
      }
    }
  }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' }) (Feed)