import { useDraggable } from '@dnd-kit/core';
import React from 'react'
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
type TaskProps= {
    task: TaskType
    taskMembers: TaskMember[]
}
enum Priority {
    high = 'high',
    med = 'med',
    low = 'low'
}
const statusColor = {
    low: 'bg-green-500',
    med: 'bg-yellow-500',
    high: 'bg-red-500'
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



function Task({task, taskMembers}: TaskProps  ) {
     const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id, 
     })
    console.log(taskMembers); 

     const style =transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, } : undefined
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={style} className='h-full flex p-1 flex-col items-center justify-center relative border-primary-bg3 hover:bg-primary-bg2 hover:border-primary-bg1 transition-all duration-75'>
        <div className='flex-grow'>{task.task_title}</div>
        <div className={`absolute top-0 left-0 ${statusColor[task.task_priority as Priority]} h-full w-2 `}></div>
        <ul className='flex justify-end w-full'>
            {taskMembers && taskMembers.map((member)=> {
                return (<li className='p-1 rounded-lg bg-primary-bg3 ' key={member.id}>{member.display_name}</li>)
            })}
        </ul>
    </div>
  )
}

export default Task 