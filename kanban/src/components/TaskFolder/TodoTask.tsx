import React from 'react'
import TaskDetails from './TaskDetails'
function TodoTask() {
  return (
    <div>
        <div className='task-group-title'>Todo</div>
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

export default TodoTask