import React, { Component } from 'react'
import { CURRENT_USER } from '../../constants'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import CreatePoll from './CreatePoll'

import { Card, Form, Input, Button } from 'antd';
const FormItem = Form.Item;

class CreatePost extends Component {
  state = {
    text: '',
    imageUrl: '',
    poll: false
  }

  render() {
    return (
      <Card
        style={{maxWidth:'600px', margin:'20px auto'}}
      >
        <Form onSubmit={this._createPost}>
          <FormItem className="flex flex-column mt3">
            <Input.TextArea
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
              type="text"
              placeholder="Share something new."
            />
          </FormItem>
        </Form>
        {this.state.poll && (
          <CreatePoll />
        )}
        <Button
          icon='picture' 
          style={{marginRight:'5px'}}
        />
        <Button
          icon='pie-chart'
          style={{marginRight:'5px'}}
          onClick={() => this.setState({ poll: !this.state.poll })}
        />
        <Button
          type='primary'
          style={{float:'right'}}
          onClick={this._createPost}
        >
          Submit
        </Button>
      </Card>
    );
  }

  _createPost = async () => {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
    const { text, imageUrl } = this.state
    await this.props.postMutation({
      variables: {
        text,
        imageUrl,
        authorId: currentUser.id
      }
    })
    // this.props.history.push(`/`)
  }
}

const POST_MUTATION = gql`
  mutation createPost($text: String!, $imageUrl: String, $authorId: ID!) {
    createPost(text: $text, imageUrl: $imageUrl, authorId: $authorId) {
      id
      text
      imageUrl
    }
  }
`
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreatePost)