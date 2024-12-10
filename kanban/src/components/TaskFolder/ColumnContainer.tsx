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

type ColumnContainerProps = {
  dialogRefUpdate: React.RefObject<HTMLDialogElement>
  dialogRef: React.RefObject<HTMLDialogElement>
}
function ColumnContainer({dialogRefUpdate, dialogRef}: ColumnContainerProps) {

  const params = useParams<{projectId: string | undefined}>();
  const {projectId} = params;
  if(!projectId){
    return <div>Cannot find project Id</div>
  }

  const queryClient = useQueryClient()



  const {isLoading: taskMembersLoading, isError: taskMembersIsError, error: taskMembersError, data: taskMembers = []} = useGetAllTaskMembersByProjectId(projectId);
  console.log("column coantainer", taskMembers);





  const {data: tasks, isLoading, isError , error} = useGetTasks(projectId);

  const {mutateAsync : updateTaskStatusQ} = useMutation({
    mutationFn : useUpdateTaskStatus,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['tasks', projectId]}) 
  }) 
  console.log(taskMembers)
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
  if (isLoading || taskMembersLoading){
    return <div>Loading...</div>
  }
  if (isError || taskMembersIsError){
    return <div>{error?.message}</div>
  }

  return (
    <div className='w-full'>
      <button className='bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' onClick={()=>{dialogRef.current?.showModal()}}><span className='text-xl font-bold'>Add Task</span></button>
      <div className='grid grid-cols-4 gap-5 lg:grid-cols-2 md:grid-cols-1'>
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((obj)=>{
            return (<TaskContainer  dialogRefUpdate={dialogRefUpdate} columnId={obj.id} columnTitle={obj.title} key={obj.id} tasks={tasks?.filter((task)=> task.task_status=== obj.id) || []} taskMembers={taskMembers.length > 0 ? taskMembers : [] }/>)
          })}
        </DndContext>
      </div>
    </div>
  )
}

export default ColumnContainer