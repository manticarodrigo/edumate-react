import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Card, Form, Input, Upload, Icon, Button, DatePicker } from 'antd'
const FormItem = Form.Item

let uuid = 2
class CreatePost extends Component {
  state = {
    pollVisible: false,
    fileList: []
  }

  removePollOption = (k) => {
    const { form } = this.props
    // can use data-binding to get
    const optionKeys = form.getFieldValue('optionKeys')
    // We need at least two options
    if (optionKeys.length <= 2) { return }
    // can use data-binding to set
    form.setFieldsValue({ optionKeys: optionKeys.filter(key => key !== k) })
    uuid += -1
  }

  addPollOption = () => {
    const { form } = this.props
    // can use data-binding to get
    const optionKeys = form.getFieldValue('optionKeys')
    const nextKeys = optionKeys.concat(uuid)
    uuid++
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({ optionKeys: nextKeys })
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
    const { getFieldDecorator } = this.props.form
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
      fileList: this.state.fileList,
    }
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
                placeholder={this.state.pollVisible ? 'Ask a question.' : 'Share something new.'}
              />
            )}
          </FormItem>
          {this.state.pollVisible && (
            this._renderPollForm()
          )}
        </Form>
        <div className='buttons-row'>
          <Button
            icon='pie-chart'
            onClick={() => this.setState({ pollVisible: !this.state.pollVisible })}
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

  _renderPollForm() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    getFieldDecorator('optionKeys', { initialValue: [0, 1] })
    const optionKeys = getFieldValue('optionKeys')
    const formItems = optionKeys.map((k, index) => {
      return (
        <FormItem
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
            <Input placeholder={'Option ' + (k+1)} style={{ width: '50%', marginRight: 8 }} />
          )}
          {optionKeys.length > 2 ? (
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
      <Card style={{ margin: '16px 0'}}>
        {formItems}
        <FormItem>
          <Button type="dashed" onClick={this.addPollOption} style={{ width: '50%' }}>
            <Icon type="plus" /> Add poll option
          </Button>
        </FormItem>
        <FormItem style={{ position: 'absolute', top: '24px', right: '24px', width: '40%' }}>
          {getFieldDecorator('pollEndDate', {
            rules: [{ required: true, message: 'End date is required!' }],
          }) (
            <DatePicker
              showTime
              name='pollEndDate'
              format="YYYY-MM-DD HH:mm"
              placeholder="End date"
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
      </Card>
    )
  }

  _createPost = async (data) => {
    const { text, pollOptions, pollEndDate } = data
    const files = this.state.fileList && this.state.fileList.length > 0 ? this.state.fileList : null
    await this.props.postMutation({
      variables: {
        text,
        files,
        pollOptions,
        pollEndDate
      }
    }).catch(error => {
      console.log(error)
    })
    this.props.history.replace(`/`)
  }
}

const POST_MUTATION = gql`
  mutation createPost($text: String!, $files: [Upload], $pollOptions: [String], $pollEndDate: DateTime) {
    createPost(
      text: $text,
      files: $files,
      pollOptions: $pollOptions,
      pollEndDate: $pollEndDate
    ) {
      id
    }
  }
`

const WrappedCreatePost = Form.create()(CreatePost)
export default withRouter(graphql(POST_MUTATION, { name: 'postMutation' })(WrappedCreatePost))