import React from 'react'
import TaskDetails from './TaskDetails'
function ProgressTask() {
  return (
    <div>
        <div className='task-group-title'>In-Progress</div>
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

export default ProgressTask