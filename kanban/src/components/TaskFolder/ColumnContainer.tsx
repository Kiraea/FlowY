import {useState} from 'react'
import TaskContainer from './TaskContainer'
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useGetTasks, useUpdateTaskStatus} from '../../hooks/QueryHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useGetAllTaskMembersByProjectId } from '../../hooks/QueryHooks';
type Column = {
  id: string,
  title: string,
};

const COLUMNS: Column[] = [
  {id: 'todo', title: 'Todo'},
  {id: 'in-progress', title: 'In-Progress'},
  {id: 'review', title: 'Review'},
  {id: 'done', title: 'Done'},
]
type TaskType =  {
  id: string; // UUID format
  task_title: string; // Corresponds to "task_title"
  task_priority: string; // Corresponds to "task_priority_type", replace `string` with an enum if needed
  task_status: string; // Corresponds to "task_status_type", replace `string` with an enum if needed
  created_at?: Date; // "created_at" is optional because of the DEFAULT value
  project_id: string; // UUID of the associated project
}


function ColumnContainer() {
  const params = useParams<{projectId: string | undefined}>();
  const {projectId} = params;
  if(!projectId){
    return <div>Cannot find project Id</div>
  }

  const {isLoading: taskMembersLoading, isError: taskMembersIsError, error: taskMembersError, data: taskMembers} = useGetAllTaskMembersByProjectId(projectId);
  console.log(taskMembers);

  if (taskMembersLoading){
    <div>is Loading...</div>
  }
  if (taskMembersIsError){
    <div>{taskMembersError.message}</div>
  }



  const queryClient = useQueryClient()
  const {data: tasks, isLoading, isError , error} = useGetTasks();

  const {mutateAsync : updateTaskStatusQ} = useMutation({
    mutationFn : useUpdateTaskStatus,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['tasks']}) 
  }) 

  async function handleDragEnd(event: DragEndEvent){
    const {active, over} = event
    if (!over) return;
    console.log("happened");
    const taskId = active.id as string;
    const newStatus = over.id as TaskType['task_status']
    try{
      await updateTaskStatusQ({taskId, newStatus})
    }catch(e){
      console.log("error in handledragend" + e);
    }
  }
  if (isLoading){
    <div>Loading...</div>
  }
  if (isError){
    <div>{error.message}</div>
  }
  return (
    <div className='grid grid-cols-4 gap-5 w-full xl:grid-cols-2 md:grid-cols-1'>
      <DndContext onDragEnd={handleDragEnd}>
        {COLUMNS.map((obj)=>{
          return (<TaskContainer columnId={obj.id} columnTitle={obj.title} key={obj.id} tasks={tasks?.filter((task)=> task.task_status=== obj.id) || []} taskMembers={taskMembers}/>)
        })}
      </DndContext>
    </div>
  )
}

export default ColumnContainer