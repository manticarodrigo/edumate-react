import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Row, Col, Card } from 'antd'
const { Meta } = Card;



class CourseList extends Component {
  render() {

    if (this.props.courseQuery && this.props.courseQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.courseQuery && this.props.courseQuery.error) {
      console.log(this.props.courseQuery.error)
      return <div>Error</div>
    }

    const coursesToRender = this.props.courseQuery.allCourses

    return (
      <Row gutter={10}>
        {coursesToRender.map(course => {
          return (
            <Col xs={1} sm={2} md={3} lg={4} xl={6}>
              <Card
                hoverable='true'
                loading={this.props.courseQuery.loading}
                style={{maxHeight:'400px'}} 
                cover={<img alt='course profile' src={ course.imageUrl ? course.imageUrl : require('../assets/images/course-placeholder.svg') }/>}
                extra={<a href="#">More</a>}
              >
                <Meta
                  title={course.name}
                  description={course.description}
                >
                </Meta>
              </Card>
            </Col>
          )
        })}
      </Row>
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