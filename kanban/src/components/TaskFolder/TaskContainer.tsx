import React, { DialogHTMLAttributes } from 'react'
import Task from './Task'
import { useDroppable } from '@dnd-kit/core';
import { useGetAllTaskMembersByProjectId } from '../../hooks/QueryHooks';
import { useParams } from 'react-router-dom';
import { TaskType,TaskStyle } from '../../Types/Types';
type TaskDetailsProps = {
  columnId: string;
  columnTitle: string;
  tasks: TaskType[];
  taskMembers: TaskMember[]
}





type TaskMember = {
  display_name: string,
  id: string,
  task_id: string,
}


function TaskContainer({columnId, columnTitle, tasks, taskMembers}: TaskDetailsProps) {

  const {setNodeRef} = useDroppable({
    id: columnId,
  })
  return (
    <div className='flex flex-col gap-0'>
      <div className='font-semibold text-xl mb-2'>{columnTitle}</div>
    <div className='flex flex-col bg-primary-bg2 h-full p-2 shadow-black shadow-md gap-2' ref={setNodeRef}>
        {tasks.map((task)=>  {
          return (<Task  task={task} key={task.id} taskStyle={TaskStyle.KanbanStyle} taskMembers={taskMembers.filter((member)=> member.task_id === task.id)}/>)
        })}
      </div>
    </div>
  )
}

export default TaskContainer