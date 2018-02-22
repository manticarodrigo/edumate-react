import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Calendar, Badge } from 'antd';

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ]; break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ]; break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ]; break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {
        listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))
      }
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

class Schedule extends Component {
  render() {

    // if (this.props.taskQuery && this.props.taskQuery.loading) {
    //   return <div>Loading</div>
    // }

    // if (this.props.taskQuery && this.props.taskQuery.error) {
    //   console.log(this.props.taskQuery.error)
    //   return <div>Error</div>
    // }

    // const tasksToRender = this.props.tasksQuery.allTasks

    return (
      <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
    )
  }
}

const TASK_QUERY = gql`
  query TaskQuery {
    allTasks(
      orderBy: createdAt_DSC
    ) {
      id
      name
      description
      author {
        id
        firstName
        lastName
        imageUrl
      }
    }
  }
`

export default graphql(TASK_QUERY, { name: 'taskQuery' }) (Schedule)