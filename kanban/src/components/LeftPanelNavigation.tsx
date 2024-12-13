import React from 'react'
import Task from './TaskFolder/Task'
import { TaskStyle, TaskType } from '../Types/Types'

type LeftPanelNavigationProps = {
  pendingTasks: TaskType[],
  taskMembers: TaskMember[],
  myTasks: TaskType[],
}

type TaskMember = {
  display_name: string,
  id: string,
  task_id: string,
}


function LeftPanelNavigation({pendingTasks,  myTasks,  taskMembers}: LeftPanelNavigationProps) {
  return (
    <div className='flex flex-col  gap-10 w-1/6 items-center bg-primary-bg1 border-primary-bg0 border-l-2 xl:flex-row xl:w-full '>
      <div className='w-full'>
        <div className='bg-primary-bg1 border-white border-2 text-center'>My Tasks</div>
        <div className='flex flex-col flex-1 bg-primary-bg1 overflow-y-scroll '>
          <div className='flex-col'>
            {myTasks && myTasks.map((task)=>  {
              return (<Task task={task} key={task.id} taskStyle={TaskStyle.KanbanStyle} taskMembers={taskMembers.filter((member)=> member.task_id === task.id)}/>)
            })}
            </div>
        </div>
      </div>
      <div className='bg-blue-100'></div>

      <div className='w-full'>
        <div className='bg-primary-bg1  text-center border-white border-2'>Unapproved Tasks</div>
        <div className='flex flex-col flex-1  overflow-y-scroll'>
          <div className='flex-col'>
            {pendingTasks.map((task)=>  {
              return (<Task task={task} key={task.id} taskStyle={TaskStyle.PendingStyle} taskMembers={taskMembers.filter((member)=> member.task_id === task.id)}/>)
            })}
            </div>
        </div>
      </div>

    </div>
  )
}

export default LeftPanelNavigation