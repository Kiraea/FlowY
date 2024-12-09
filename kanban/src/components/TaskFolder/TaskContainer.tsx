import React, { DialogHTMLAttributes } from 'react'
import Task from './Task'
import { useDroppable } from '@dnd-kit/core';
import { useGetAllTaskMembersByProjectId } from '../../hooks/QueryHooks';
import { useParams } from 'react-router-dom';
type TaskDetailsProps = {
  columnId: string;
  columnTitle: string;
  tasks: TaskType[];
  taskMembers: TaskMember[]
  dialogRefUpdate: React.RefObject<HTMLDialogElement>
}



type TaskType =  {
  id: string; // UUID format
  task_title: string; // Corresponds to "task_title"
  task_priority: string; // Corresponds to "task_priority_type", replace `string` with an enum if needed
  task_status: string; // Corresponds to "task_status_type", replace `string` with an enum if needed
  created_at?: Date; // "created_at" is optional because of the DEFAULT value
  project_id: string; // UUID of the associated project
}

type TaskMember = {
  display_name: string,
  id: string,
  task_id: string,
}


function TaskContainer({columnId, columnTitle, tasks, taskMembers, dialogRefUpdate}: TaskDetailsProps) {
  console.log("taskcontainer" + taskMembers)


  const {setNodeRef} = useDroppable({
    id: columnId,
  })
  return (
    <div className='flex flex-col gap-0'>
      <div className='font-semibold text-xl mb-2'>{columnTitle}</div>
      <div className='flex flex-col bg-primary-bg1 h-full' ref={setNodeRef}>
        {tasks.map((task)=>  {
          return (<Task dialogRefUpdate={dialogRefUpdate} task={task} key={task.id} taskMembers={taskMembers.filter((member)=> member.task_id === task.id)}/>)
        })}
      </div>
    </div>
  )
}

export default TaskContainer