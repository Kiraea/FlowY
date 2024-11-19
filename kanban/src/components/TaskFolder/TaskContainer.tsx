import React from 'react'
import TodoTask from './TodoTask'
import ReviewTask from './ReviewTask'
import ProgressTask from './ProgressTask'
import DoneTask from './DoneTask'
function TaskContainer() {
  return (
    <div className='grid grid-cols-4 gap-20 w-full'>
      <TodoTask/>
      <ProgressTask/>
      <ReviewTask/>
      <DoneTask/>
    </div>
  )
}

export default TaskContainer