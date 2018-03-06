import React, { Component } from 'react'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate } from '../../utils'

import UploadFile from './UploadFile'
import CreatePost from './CreatePost'
import VoteCheckbox from './VoteCheckbox'

import { List, Card, Icon, Avatar, Spin, Modal, Alert } from 'antd';
const { Meta } = Card;

class Feed extends Component {
  state = {
    modalVisible: false,
    modalImg: ''
  }
  showModal = (imageUrl) => {
    console.log(imageUrl)
    this.setState({
      modalVisible: true,
      modalImg: imageUrl
    })
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    })
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    })
  }
  render() {

    const spinnerIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

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

    return (
      <div>
        <UploadFile />
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
              {post.imageUrl &&
                <Card
                  hoverable='true'
                  className='post-img'
                  cover={<img style={{padding:'5px'}} alt='post attachment' src={post.imageUrl}/>}
                  onClick={() => this.showModal(post.imageUrl)}
                />
              }
              {post.poll && 
                <List
                  bordered
                  size='small'
                  className='post-poll'
                  dataSource={post.poll.options}
                  renderItem={option => (
                    <List.Item actions={[<VoteCheckbox />]}>
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
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      author {
        id
        firstName
        lastName
        imageUrl
      }
      createdAt
      text
      imageUrl
      poll {
        options {
          name
        }
      }
    }
  }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' }) (Feed)