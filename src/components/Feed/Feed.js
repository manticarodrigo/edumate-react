import React, { Component } from 'react'

import './Feed.css'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import CreatePost from '../Post/CreatePost'
import Post from '../Post/Post'

import { List, Icon, Spin, Alert } from 'antd'

class Feed extends Component {
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
            <Post post={post} feedQuery={this.props.feedQuery} currentUser={currentUser} />
          )}
        />
      </div>
    )
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
        image {
          url
        }
      }
      text
      images {
        id
        url
        filename
      }
      poll {
        id
        endDate
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