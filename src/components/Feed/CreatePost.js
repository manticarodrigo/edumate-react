import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { CURRENT_USER } from '../../constants'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import CreatePoll from './CreatePoll'

import { Card, Form, Input, Upload, message, Button } from 'antd';
const FormItem = Form.Item;

const PostForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      text: Form.createFormField({
        ...props.text,
        value: props.text.value,
      })
    }
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <span>
      <FormItem>
        {getFieldDecorator('text', {
          rules: [{ required: true, message: 'Text is required!' }],
        }) (
          <Input.TextArea
            name='text'
            type='text'
            placeholder='Share something new.'
          />
        )}
      </FormItem>
    </span>
  )
})

class CreatePost extends Component {
  state = {
    poll: false,
    fileList: [],
    fields: {
      text: {
        value: ''
      },
      imageUrl: {
        value: ''
      }
    }
  }

  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    })
  }

  render() {
    const fields = this.state.fields
    const props = {
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }))
        return false;
      },
      fileList: this.state.fileList,
    }
    return (
      <Card
        className='create-post-card'
      >
        <Form onSubmit={this._createPost}>
          <PostForm {...fields} onChange={this.handleFormChange} />
          {this.state.poll && (
            <CreatePoll />
          )}
        </Form>
        <div className='buttons-row'>
          <Button
            icon='pie-chart'
            onClick={() => this.setState({ poll: !this.state.poll })}
          />
          <Upload {...props}>
            <Button
              icon='picture'
            />
          </Upload>
          <Button
            type='primary'
            onClick={this._createPost}
            className='submit-btn'
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  }

  _createPost = async () => {
    const { fileList } = this.state
    if (fileList.length > 0) {
      this._uploadFile(fileList)
      .then(file => {
        this.setState({
          fields: { ...this.state.fields, imageUrl: { value: file.url }}
        })
        console.log(this.state)
        this._submitData()
      })
      .catch(error => {
        message.error(error)
      })
    } else {
      this._submitData()
    }
  }

  _uploadFile = (files) => {
    return new Promise((resolve, reject) => {
      let data = new FormData()
      data.append('data', files[0])
      // use the file endpoint
      fetch('https://api.graph.cool/file/v1/cjcyysjgy13rn0150zufcr4jq', {
        method: 'POST',
        body: data
      }).then(response => {
        return response.json()
      }).then(file => {
        if (file) {
          resolve(file)
        } else {
          reject(null)
        }
      })
    })
  }

  _submitData = async () => {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
    const { text, imageUrl } = this.state.fields
    console.log(text)
    console.log(imageUrl)
    await this.props.postMutation({
      variables: {
        text: text.value,
        imageUrl: imageUrl.value,
        authorId: currentUser.id
      }
    })
    this.props.history.push(`/`)
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
export default withRouter(graphql(POST_MUTATION, { name: 'postMutation' })(CreatePost))