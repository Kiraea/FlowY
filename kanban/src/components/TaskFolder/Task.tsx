import { useDraggable } from '@dnd-kit/core';
import React from 'react'
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { FaUserGroup } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { useDeleteTask, useUpdateTaskFull } from '../../hooks/QueryHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {useContext } from 'react'
import { selectedTaskContext } from '../../context/selectedTaskContext';

type TaskProps= {
    task: TaskType
    taskMembers: TaskMember[],
    dialogRefUpdate: React.RefObject<HTMLDialogElement>
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



function Task({task, taskMembers, dialogRefUpdate}: TaskProps  ) {

  const {setSelectedTaskId, selectedTaskId} = useContext(selectedTaskContext)

  const params = useParams();
  const projectId = params.projectId;

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: task.id, 
  })
  console.log(taskMembers); 
  const queryClient = useQueryClient()
    
  const onTaskDelete = async (e: React.MouseEvent<HTMLButtonElement>, taskId: string) => {

    e.preventDefault()
    console.log(taskId + "ondelete");
    deleteTaskMutation(taskId)
  }

  const {mutateAsync: deleteTaskMutation} = useMutation({
    mutationFn: useDeleteTask,
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['tasks', projectId]})}
  })
  const style =transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, } : undefined



  return (
  <div className='group border-primary-bg05 hover:bg-primary-bg3 border-b-2 pt-4 pb-2 ps-5 pe-2  gap-3 items-start bg-primary-bg1 relative hover:bg-primary-bg1 transition-all duration-75'>
    <div ref={setNodeRef} {...listeners} {...attributes} style={style} className='flex flex-col gap-3'>
      <div className='font-mono group-hover:ml-10 transition-all'>{task.task_title}</div>
      <ul className='flex justify-end w-full gap-2 items-center'>
        <li><FaUserGroup/> </li>
          {taskMembers.length > 0 && taskMembers.map((member)=> {
            return (<li className='px-1 text-xs rounded-lg bg-primary-bg2 shadow-black shadow-sm' key={member.id}>{member.display_name}</li>)
            })}
          {taskMembers.length === 0 && <li className='text-xs px-1 rounded-lg bg-primary-bg2 shadow-black shadow-sm'>Not Assigned</li>}
        </ul>
    </div>
    <div className={`absolute top-0 left-0 ${statusColor[task.task_priority as Priority]} h-full w-1 group-hover:w-8 flex flex-col items-center justify-evenly group-hover:opacity-100 transition-all`}>
      <button className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={()=>{setSelectedTaskId("999"); console.log("selected" +selectedTaskId); dialogRefUpdate.current?.showModal()}}><IoIosSettings/></button>
      <button className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=>{e.stopPropagation(); onTaskDelete(e, task.id)}}><RiDeleteBin6Fill/></button>
    </div>
  </div>
  )
}

export default Task 

