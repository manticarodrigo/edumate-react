import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { CURRENT_USER } from '../../constants'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Card, Form, Input, Upload, message, Icon, Button } from 'antd';
const FormItem = Form.Item;

let uuid = 0
class CreatePost extends Component {
  state = {
    poll: false,
    fileList: [],
    imageUrl: ''
  }

  removePollOption = (k) => {
    const { form } = this.props
    // can use data-binding to get
    const optionKeys = form.getFieldValue('optionKeys')
    // We need at least one passenger
    if (optionKeys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      optionKeys: optionKeys.filter(key => key !== k),
    })
  }

  addPollOption = () => {
    const { form } = this.props
    // can use data-binding to get
    const optionKeys = form.getFieldValue('optionKeys')
    const nextKeys = optionKeys.concat(uuid)
    uuid++
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      optionKeys: nextKeys,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this._createPost(values)
      } else {
        console.log(err)
      }
    });
  }

  render() {
    const uploadProps = {
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
    const { getFieldDecorator, getFieldValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }
    getFieldDecorator('optionKeys', { initialValue: [] })
    const optionKeys = getFieldValue('optionKeys')
    const formItems = optionKeys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'Poll options' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`pollOptions[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please enter an option or delete this field.",
            }],
          })(
            <Input placeholder="option name" style={{ width: '60%', marginRight: 8 }} />
          )}
          {optionKeys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={optionKeys.length === 1}
              onClick={() => this.removePollOption(k)}
            />
          ) : null}
        </FormItem>
      )
    })
    return (
      <Card
        className='create-post-card'
      >
        <Form>
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
          {this.state.poll && (
            <div>
              {formItems}
              <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.addPollOption} style={{ width: '60%' }}>
                  <Icon type="plus" /> Add poll option
                </Button>
              </FormItem>
            </div>
          )}
        </Form>
        <div className='buttons-row'>
          <Button
            icon='pie-chart'
            onClick={() => this.setState({ poll: !this.state.poll })}
          />
          <Upload {...uploadProps}>
            <Button
              icon='picture'
            />
          </Upload>
          <Button
            type='primary'
            onClick={this.handleSubmit}
            className='submit-btn'
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  }

  _createPost = async (data) => {
    const { fileList } = this.state
    if (fileList.length > 0) {
      this._uploadFile(fileList)
      .then(file => {
        this.setState({
          imageUrl: file.url
        })
        this._submitData(data)
      })
      .catch(error => {
        message.error(error)
      })
    } else {
      this._submitData(data)
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

  _submitData = async (data) => {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
    const { text, pollOptions } = data
    var pollOptionObjects = []
    for (var i=0; i<pollOptions.length; i++) {
      pollOptionObjects.push({name: pollOptions[i]})
    }
    const imageUrl = this.state.imageUrl
    console.log(text)
    console.log(imageUrl)
    await this.props.postMutation({
      variables: {
        text: text,
        imageUrl: imageUrl,
        pollOptions: pollOptionObjects,
        authorId: currentUser.id
      }
    })
    this.props.history.push(`/`)
  }
}

const POST_MUTATION = gql`
  mutation createPost($text: String!, $imageUrl: String, $pollOptions: [PollOption], $authorId: ID!) {
    createPost(text: $text, imageUrl: $imageUrl, options: $pollOptions, authorId: $authorId) {
      id
      text
      imageUrl
      poll {
        options
      }
    }
  }
`
const WrappedCreatePost = Form.create()(CreatePost);
export default withRouter(graphql(POST_MUTATION, { name: 'postMutation' })(WrappedCreatePost))