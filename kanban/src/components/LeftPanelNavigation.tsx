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
    <div className='flex flex-col gap-10 w-1/6 items-center xl:flex-row xl:w-full '>
      <div className='w-full flex flex-col  gap-3'>
        <div className='rounded-lg font-bold shadow-md shadow-black bg-primary-bg2  text-center'>My Tasks</div>
        <div className='flex flex-col flex-1 bg-primary-bg1  '>
          <div className='flex-col overflow-y-scroll'>
            {myTasks && myTasks.map((task)=>  {
              return (<Task task={task} key={task.id} taskStyle={TaskStyle.KanbanStyle} taskMembers={taskMembers.filter((member)=> member.task_id === task.id)}/>)
            })}
            </div>
           
        </div>
        {myTasks && myTasks.length <= 0 && <div className='text-center '>No Tasks to do</div>}
      </div>
      <div className='bg-blue-100'></div>

      <div className='w-full flex flex-col gap-3'>
        <div className=' rounded-lg bg-primary-bg2 font-bold text-center shadow-md shadow-black '>Unapproved Tasks</div>
        <div className='flex flex-col flex-1    '>
          <div className='flex-col flex gap-3 p-1 overflow-y-scroll bg-primary-bg2 shadow-md shadow-black'>
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