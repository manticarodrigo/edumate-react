import React, { Component } from 'react'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate } from '../../utils'

import CreatePost from './CreatePost'

import { List, Card, Icon, Avatar, Spin, Alert } from 'antd';
const { Meta } = Card;

class Feed extends Component {
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
    

    var postsToRender = this.props.feedQuery.allPosts

    return (
      <div>
        <CreatePost />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={postsToRender}
          renderItem={post => (
            <Card
              loading={this.props.feedQuery.loading}
              className='post-card'
              actions={[<div><Icon type='like-o' /> Like</div>, <div><Icon type='form' /> Comment</div>, <div><Icon type='export' /> Share</div>]}
            >
              <Meta
                avatar={<Avatar src={post.author.imageUrl ? post.author.imageUrl : require('../../assets/images/user-placeholder.png')} />}
                title={<div className="post-author"><h4>{post.author.firstName} {post.author.lastName}</h4><p>{timeDifferenceForDate(post.createdAt)}</p></div>}
                description={post.text}
              />
              {post.imageUrl &&
                <Card
                  hoverable='true'
                  style={{margin:'16px 8px', maxHeight:'300px', maxWidth:'300px'}}
                  cover={<img style={{padding:'5px'}} alt='post attachment' src={post.imageUrl}/>}
                ></Card>
              }
            </Card>
          )}
        />
      </div>
    )
  }
}

const FEED_QUERY = gql`
  query FeedQuery {
    allPosts(
      orderBy: createdAt_DESC
    ) {
      id
      createdAt
      text
      imageUrl
      author {
        id
        firstName
        lastName
        imageUrl
      }
    }
  }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' }) (Feed)