import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { List, Card, Icon, Spin, Alert } from 'antd'
const { Meta } = Card;



class CourseList extends Component {
  render() {

    const spinnerIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (this.props.courseQuery && this.props.courseQuery.loading) {
      return <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin:'0'}}><Spin indicator={spinnerIcon}/> LOADING</div>
    }

    if (this.props.courseQuery && this.props.courseQuery.error) {
      console.log(this.props.courseQuery.error)
      return (
        <Alert
          message="ERROR"
          description="There was a problem loading your courses."
          type="error"
          showIcon
          banner
        />
      )
    }

    const coursesToRender = this.props.courseQuery.allCourses

    return (
      <List 
        grid={{gutter:16,column:4}}
        dataSource={coursesToRender}
        renderItem={course => (
          <List.Item>
            <Card
              hoverable='true'
              loading={this.props.courseQuery.loading}
              style={{maxHeight:'400px'}} 
              cover={<img alt='course profile' src={ course.imageUrl ? course.imageUrl : require('../assets/images/course-placeholder.svg') }/>}
              extra={<a href="/">More</a>}
            >
              <Meta
                title={course.name}
                description={course.description}
              >
              </Meta>
            </Card>
          </List.Item>
        )}
      />
    )
  }
}

const COURSE_QUERY = gql`
  query CourseQuery {
    allCourses {
      id
      name
      description
      instructors {
        id
        firstName
        lastName
        imageUrl
      }
    }
  }
`

export default graphql(COURSE_QUERY, { name: 'courseQuery' }) (CourseList)