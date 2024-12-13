import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { FaUserGroup } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { useDeleteTask, useUpdateTaskFull, useUpdateTaskStatus, useUpdateTaskUpdate } from '../../hooks/QueryHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {useContext } from 'react'
import { selectedTaskContext } from '../../context/selectedTaskContext';
import { TaskType, TaskStyle, TaskUpdateOption } from '../../Types/Types';
import { RiAddBoxFill } from "react-icons/ri";
import { IoIosCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io"; 
import { ProjectMembersContext } from '../../context/ProjectMembersContext';
type TaskProps= {
    task: TaskType
    taskMembers: TaskMember[],
    taskStyle: TaskStyle
    
}
import { MdAddReaction } from "react-icons/md";

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
const statusColorText = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500'
}

type TaskMember = {
  display_name: string,
  id: string,
  task_id: string,
} 



function Task({task, taskMembers, taskStyle}: TaskProps  ) {
  const [openMemberList, setOpenMemberList] = useState(false)
  const {setSelectedTaskId, selectedTaskId, openModal} = useContext(selectedTaskContext)
  const {isErrorProjectMembers, isLoadingProjectMembers, errorProjectMembers, projectMembers} = useContext(ProjectMembersContext);

  projectMembers.map((pm)=>{
    console.log(pm.member_id + pm.role)
  })


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


  const {mutateAsync: updateTaskUpdateMutation} = useMutation({
    mutationFn: useUpdateTaskUpdate,
    onSuccess: ()=> {queryClient.invalidateQueries({queryKey: ['tasks', projectId]})}
  })

  const onUpdateTaskUpdate = async (e: React.MouseEvent<HTMLButtonElement>, taskId: string, taskUpdateOption: TaskUpdateOption) => {

    e.preventDefault()
    console.log(taskId + "ondelete");
    updateTaskUpdateMutation({taskId, taskUpdateOption})
  }



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

      {taskStyle === TaskStyle.KanbanStyle && <button className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={()=>{console.log("dsaldsa"); setSelectedTaskId(task.id); openModal()}}><IoIosSettings/></button>}
      {taskStyle === TaskStyle.KanbanStyle && <button className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=>{e.stopPropagation(); onTaskDelete(e, task.id)}}><RiDeleteBin6Fill/></button>}

      {taskStyle === TaskStyle.PendingStyle && <button className=' invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=> {onUpdateTaskUpdate(e, task.id, TaskUpdateOption.accept)}}><IoIosCheckmark className=''/></button>}
      {taskStyle === TaskStyle.PendingStyle && <button className=' invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=> {onTaskDelete(e,task.id)}}><IoClose className=' '/></button>}     

    </div>
    <div className={`absolute top-0 right-0`}>
      <button className="z-30" onMouseEnter={()=>{setOpenMemberList(true)}} onMouseLeave={()=>{setOpenMemberList(false)}}> <MdAddReaction className="relative"/></button>
      {openMemberList &&
      
      <div className='absolute top-0 -right-36 bg-primary-bg1 border-2 border-primary-highlight2 z-10'>
        {projectMembers.length > 0 && projectMembers.map((member)=> {
          return (
          <div key={member.id} className='flex p-5 gap-5' onMouseEnter={()=>{setOpenMemberList(true)}} onMouseLeave={()=>{setOpenMemberList(false)}}>
            <input type='checkbox'/>
            <label>{member.display_name}</label>
          </div>)
        })}
      </div>
      }
    </div>
  </div>
  )
}

export default Task 

