import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreatePost extends Component {
  state = {
    text: '',
    imageUrl: '',
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            type="text"
            placeholder="A description for the post"
          />
          <input
            className="mb2"
            value={this.state.imageUrl}
            onChange={e => this.setState({ imageUrl: e.target.value })}
            type="text"
            placeholder="The image URL for the post"
          />
        </div>
        <button onClick={() => this._createPost()}>Submit</button>
      </div>
    )
  }

  _createPost = async () => {
    const { text, imageUrl } = this.state
    await this.props.postMutation({
      variables: {
        text,
        imageUrl
      }
    })
    this.props.history.push(`/`)
  }
}

const POST_MUTATION = gql`
  mutation createPost($text: String!, $imageUrl: String!) {
    createPost(text: $text, imageUrl: $imageUrl, authorId: "cjd3gav75258n0197hbj0btb0") {
      id
      text
      imageUrl
    }
  }
`

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreatePost)