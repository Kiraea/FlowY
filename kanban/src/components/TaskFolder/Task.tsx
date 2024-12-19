import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { FaUserGroup } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { useAddDeleteTaskMemberAssignment, useDeleteTask, useGetAllProjectMembersByProjectId, useUpdateTaskFull, useUpdateTaskStatus, useUpdateTaskUpdate } from '../../hooks/QueryHooks';
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
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
type TaskProps= {
    task: TaskType
    taskMembers: TaskMember[],
    taskStyle: TaskStyle
    
}
import { MdAddReaction } from "react-icons/md";
import { MemberRoleContext } from '../../context/MemberRoleContext';
import { SelectedTaskAssignmentContext } from '../../context/selectedTaskAssignmentContext';

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
const statusColorBorder = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500'
}
type TaskMember = {
  display_name: string,
  id: string,
  task_id: string,
} 



function Task({task, taskMembers, taskStyle}: TaskProps  ) {

  const {myRole, setMyRole} = useContext(MemberRoleContext);
  const [openMemberList, setOpenMemberList] = useState(false)
  const {setSelectedTaskId, setSelectedPriority, setSelectedTitle, setSelectedStatus, selectedTaskId, openModal} = useContext(selectedTaskContext)

  const {selectedTaskIdAssignment, togglePopup} = useContext(SelectedTaskAssignmentContext)

  const isOpen = task.id === selectedTaskIdAssignment



  const params = useParams();
  const projectId = params.projectId;

  const {isError: isErrorProjectMembers, isLoading:  isLoadingProjectMembers, error:  errorProjectMembers, data:  projectMembers} = useGetAllProjectMembersByProjectId(projectId);
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: task.id, 
  })
  const queryClient = useQueryClient()
    
  const onTaskDelete = async (e: React.MouseEvent<HTMLButtonElement>, taskId: string) => {

    e.preventDefault()
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
    updateTaskUpdateMutation({taskId, taskUpdateOption})
  }

    const {mutateAsync: useAddDeleteTaskMemberAssignmentMutation} = useMutation({
    mutationFn: useAddDeleteTaskMemberAssignment,
    onSuccess: ()=> {queryClient.invalidateQueries({queryKey: ['taskMembers', projectId]})}
  })
  const handleSubmitTaskAssignment = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    let membersId  = formData.getAll("membersId") as string[]
    const taskId = task.id;
    if (projectId)
    useAddDeleteTaskMemberAssignmentMutation({membersId, projectId, taskId})
    togglePopup(taskId);
  }


  return (
  <div className='shadow-sm shadow-black group border-primary-bg05 hover:bg-primary-bg3 border-b-2 pt-4 pb-2 ps-5 pe-2  gap-3 items-start bg-primary-bg1 relative hover:bg-primary-bg1 transition-all duration-75'>
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

      {myRole !== "member" && taskStyle === TaskStyle.KanbanStyle && <button className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={()=>{ setSelectedTaskId(task.id); setSelectedPriority(task.task_status); setSelectedPriority(task.task_priority); setSelectedTitle(task.task_title);  openModal()}}><IoIosSettings/></button>}
      {myRole !== "member" && taskStyle === TaskStyle.KanbanStyle && <button className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=>{e.stopPropagation(); onTaskDelete(e, task.id)}}><RiDeleteBin6Fill/></button>}

      {myRole !== "member" && taskStyle === TaskStyle.PendingStyle && <button className=' invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=> {onUpdateTaskUpdate(e, task.id, TaskUpdateOption.accept)}}><IoIosCheckmark className=''/></button>}
      {myRole !== "member" && taskStyle === TaskStyle.PendingStyle && <button className=' invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity' onClick={(e)=> {onTaskDelete(e,task.id)}}><IoClose className=' '/></button>}     

    </div>
    <div className={`absolute top-0 right-0`}>
      <button className="z-30" onClick={()=>{togglePopup(task.id)}}> <HiOutlineSquare3Stack3D className="relative"/></button>
      {isOpen &&
      <form onMouseLeave={()=>togglePopup(task.id)} onSubmit={handleSubmitTaskAssignment} className={`min-w-60 absolute flex flex-col p-5 top-0 -right-72 bg-primary-bg1 border-2 ${statusColorBorder[task.task_priority as Priority]}  z-10`}>
        <label className='text-xl font-bold '>Assign Task</label>
        {projectMembers.length > 0 && projectMembers.map((member)=> {
          return (
          <div key={member.id} className='flex p-5 gap-5'>
            <input type='checkbox' name='membersId' value={member.member_id}/>
            <label>{member.display_name}</label>
          </div>)
        })}
        <div className='min-w-full flex gap-5'>
          <button type='submit' className='flex-1 bg-primary-bg1 rounded-lg p-2 hover:bg-primary-bg2 shadow-black shadow-sm'>Update</button>
          <button className=' flex-1 bg-primary-bg1 rounded-lg p-2 hover:bg-primary-bg2 shadow-black shadow-sm' onClick={()=>{togglePopup(task.id)}}>X</button>
        </div>
      </form>
      }
    </div>
  </div>
  )
}

export default Task 

