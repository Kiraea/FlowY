import React from 'react'
import TaskDetails from './TaskDetails'

function DoneTask() {
  return (
    <div>
        <div className='task-group-title'>Done</div>
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

export default DoneTask