import React from 'react'
import TaskDetails from './TaskDetails'
function ReviewTask() {
  return (
    <div>
        <div className='task-group-title'>In-Review</div>
        <div className='task-group-container'>
            <TaskDetails/>
            <TaskDetails/>
            <TaskDetails/>
            <TaskDetails/>
            <TaskDetails/>
        </div>
    </div>
  )
}

export default ReviewTask