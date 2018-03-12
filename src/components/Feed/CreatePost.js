import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Card, Form, Input, Upload, Icon, Button } from 'antd'
const FormItem = Form.Item

let uuid = 0
class CreatePost extends Component {
  state = {
    poll: false,
    fileList: []
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
    e.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('Received values from form: ', values)
        this._createPost(values)
      } else {
        console.log(error)
      }
    })
  }

  render() {
    const uploadProps = {
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file)
          const newFileList = fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }))
        return false
      },
      // fileList: this.state.fileList,
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
                placeholder={this.state.poll ? 'Ask a question.' : 'Share something new.'}
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
    const { text, pollOptions } = data
    var pollOptionArr = []
    if (pollOptions) {
      for (var i=0; i<pollOptions.length; i++) {
        pollOptionArr.push({name: pollOptions[i]})
      }
    }
    const poll = pollOptionArr.length > 0 ? { create: { options: { create: pollOptionArr } } } : null
    const images = this.state.fileList
    await this.props.postMutation({
      variables: {
        text,
        images,
        poll
      }
    }).catch(error => {
      console.log(error)
    })
    this.props.history.push(`/`)
  }
}

const POST_MUTATION = gql`
  mutation createPost($text: String!, $images: [Upload], $poll: PollCreateOneWithoutPostInput) {
    createPost(
      text: $text,
      images: $images,
      poll: $poll
    ) {
      id
      text
      imageUrl
    }
  }
`

const WrappedCreatePost = Form.create()(CreatePost)
export default withRouter(graphql(POST_MUTATION, { name: 'postMutation' })(WrappedCreatePost))