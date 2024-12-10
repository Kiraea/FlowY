import { useDraggable } from '@dnd-kit/core';
import React from 'react'
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { FaUserGroup } from "react-icons/fa6";
type TaskProps= {
    task: TaskType
    taskMembers: TaskMember[]
}
enum Priority {
    high = 'high',
    medium = 'medium',
    low = 'low'
}
const statusColor = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
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
        <div ref={setNodeRef} {...listeners} {...attributes} style={style} className='border-primary-bg05 hover:bg-primary-bg3 border-b-2 pt-4 pb-2 ps-5 pe-2 flex flex-col gap-3 items-start bg-primary-bg1 relative hover:bg-primary-bg1 transition-all duration-75'>
            <div className='font-mono'>{task.task_title}</div>
            <div className={`absolute top-0 left-0 ${statusColor[task.task_priority as Priority]} h-full w-2 `}></div>
            <ul className='flex justify-end w-full gap-2 items-center'>
                <li><FaUserGroup/> </li>
                {taskMembers.length > 0 && taskMembers.map((member)=> {
                    return (<li className='px-1 text-xs rounded-lg bg-primary-bg2 shadow-black shadow-sm' key={member.id}>{member.display_name}</li>)
                })}
                {taskMembers.length === 0 && <li className='text-xs px-1 rounded-lg bg-primary-bg2 shadow-black shadow-sm'>Not Assigned</li>}
            </ul>
    </div>
  )
}

export default Task 