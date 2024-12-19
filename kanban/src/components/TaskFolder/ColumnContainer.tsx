import {useState, useEffect, useContext} from 'react'
import TaskContainer from './TaskContainer'
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useGetTasks, useGetUserId, useUpdateTaskStatus} from '../../hooks/QueryHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useGetAllTaskMembersByProjectId } from '../../hooks/QueryHooks';
import LeftPanelNavigation from '../LeftPanelNavigation';
import { TaskType } from '../../Types/Types';
import { Sort } from '../../Types/Types';
import { useSortHook } from '../../hooks/SortHooks';
import { MemberRoleContext } from '../../context/MemberRoleContext';
import { SelectedTaskAssignmentContextProvider } from '../../context/selectedTaskAssignmentContext';
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


type ColumnContainerProps = {

  dialogRef: React.RefObject<HTMLDialogElement>
}
function ColumnContainer({dialogRef}: ColumnContainerProps) {


  const {myRole, setMyRole} = useContext(MemberRoleContext)

  const [sort, setSort] = useState<Sort>(Sort.Title)

  const params = useParams<{projectId: string | undefined}>();
  const {projectId} = params;
  if(!projectId){
    return <div>Cannot find project Id</div>
  }

  const queryClient = useQueryClient()



  const {isLoading: taskMembersLoading, isError: taskMembersIsError, error: taskMembersError, data: taskMembers = []} = useGetAllTaskMembersByProjectId(projectId);

  const userId =  useGetUserId() // async axios btw

  const {data: tasks, isLoading, isError , error} = useGetTasks(projectId);

  const allTasks: TaskType[] = tasks?.data;
  const myTasks: TaskType[] = tasks?.data2;
  let pendingTasks: TaskType[] = allTasks ? allTasks.filter((task)=>{ return (task.task_update === 'pending')}): [] 
  let sortedTasks: TaskType[]= useSortHook(sort, allTasks || []);
  let sortedNoPendingTasks = sortedTasks.filter((task)=> { return task.task_update !== 'pending'})


  
  useEffect(() => {
    console.log('Sorted tasks have changed:', sortedTasks);
  }, [sortedTasks]);  // This effect will run every time sortedTasks change
  const {mutateAsync : updateTaskStatusQ} = useMutation({
    mutationFn : useUpdateTaskStatus,
    onSuccess: () => queryClient.refetchQueries({queryKey: ['tasks', projectId]}) 
  }) 
  //console.log(taskMembers)
  async function handleDragEnd(event: DragEndEvent){
    const {active, over} = event
    if (!over) return;
    //console.log("happened");
    const taskId = active.id as string;
    const newStatus = over.id as TaskType['task_status']
    try{
      await updateTaskStatusQ({taskId, newStatus})
    }catch(e){
      //console.log("error in handledragend" + e);
    }
  }
  if (isLoading || taskMembersLoading){
    return <div>Loading...</div>
  }
  if (isError || taskMembersIsError){
    return <div>{error?.message}</div>
  }





  return (
    <div className='w-full flex xl:flex-col gap-5 max-h-screen'>
      <div className='flex-1'>
        <div className='flex items-center'>

          <div className='flex-1'>
            {(myRole === 'leader' || myRole ==='admin') && <button className=' bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' onClick={()=>{dialogRef.current?.showModal()}}><span className='text-xl font-bold'>Add Task</span></button>}
          </div>
          
          <div className='ml-auto '>
            <select onChange={(e)=> {setSort(e.target.value as Sort)}} className='font-bold bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'>
              <option value={Sort.Priority}>Priority</option>
              <option value={Sort.Title}>Title</option>
            </select>
          </div>

        </div>
        <div className='grid grid-cols-4 gap-5 lg:grid-cols-2 md:grid-cols-1'>
          <SelectedTaskAssignmentContextProvider>
          <DndContext onDragEnd={handleDragEnd}>
            {COLUMNS.map((obj)=>{
              return (<TaskContainer columnId={obj.id} columnTitle={obj.title} key={obj.id} tasks={sortedNoPendingTasks?.filter((task)=> task.task_status=== obj.id) || []} taskMembers={taskMembers.length > 0 ? taskMembers : [] }/>)
            })}
          </DndContext>
          </SelectedTaskAssignmentContextProvider>
        </div>
      </div>



      {tasks && <LeftPanelNavigation myTasks={myTasks} pendingTasks={pendingTasks} taskMembers={taskMembers.length > 0 ? taskMembers : []} />}
    </div>
  )
}

export default ColumnContainer