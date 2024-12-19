import { useEffect , useState, useContext, useRef, RefObject} from 'react'
import LeftPanelNavigation from '../components/LeftPanelNavigation'
import { axiosInstance } from '../axios/axios'
import { useParams } from 'react-router-dom'
import { ErrorComponent, ErrorContext } from '../context/ErrorContext'
import { Axios, AxiosError } from 'axios'
import Settings from '../components/content/Settings'
import Specifications from '../components/content/Specifications'
import Links from '../components/content/WhiteBoard'
import People from '../components/content/People'
import ColumnContainer from '../components/TaskFolder/ColumnContainer'
import { TfiControlBackward } from "react-icons/tfi";
import { Link } from 'react-router-dom'
import { GrProjects } from "react-icons/gr";
import { IoPeopleSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useAddTaskFull } from '../hooks/QueryHooks'
import { useUpdateTaskFull } from '../hooks/QueryHooks'
import { selectedTaskContext } from '../context/selectedTaskContext'

import { useGetAllProjectMembersByProjectId } from '../hooks/QueryHooks'
import { MemberRoleContext, MemberRoleProvider } from '../context/MemberRoleContext'
import WhiteBoard from '../components/content/WhiteBoard'

enum Content{

  Main = 'Main',
  People = 'People',
  Settings = 'Settings',
  WhiteBoard = 'WhiteBoard',
  Specifications = 'Specifications'
}
type dataObjectType = {
  taskId: string,
  title:string,
  status: string,
  priority: string,
}
function ProjectPage() {
  const [myRole, setMyRole] = useState("")
  const {errorC, setErrorC} = useContext(ErrorContext)
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<Content>(Content.Main);


  const params = useParams();
  const projectId = params.projectId || '';
  console.log(projectId + "ProjectId in project page");

  const {selectedTaskId, selectedPriority, selectedStatus, selectedTitle, openModal, closeModal, dialogRefUpdate} = useContext(selectedTaskContext)

  console.log(selectedPriority, selectedPriority, selectedTitle, selectedTaskId + "dksaodksaoda");





  useEffect(()=> {
    const getQuery = async () => {
      try{
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/verifyProjectAccess`, {projectId: projectId});
        if(result.status === 200){
          console.log("USE EFFECT"  + result.data.data.role)
          setMyRole(result.data.data.role);
          setHasAccess(result.data.data);
        }

      }catch(e:unknown){
        if (e instanceof AxiosError){
          setErrorC(e.response?.data.error);
        }
      }finally{
        setIsLoading(false)
      }

    }
    getQuery()
  }, [projectId])

  if(isLoading){
    <div>is Loading...</div>
  }

  if (!isLoading){
    if(!hasAccess){
      <div>u cannot access the project</div>
    }
  }
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const queryClient = useQueryClient()

  const {mutateAsync: addTaskMutation} = useMutation ({
    mutationFn:useAddTaskFull,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks", projectId]}); console.log("dkasodsa");
    }
  })

  const submitTodo = async (e)=> {
    e.preventDefault()
    const data = new FormData(e.target)
    projectId ? data.append("projectId", projectId) : null
    for (const value of data.values()) {
      console.log(value);
    }
    for (const value of data.keys()) {
      console.log(value);
    }
    addTaskMutation(data)
  }

  const {mutateAsync: updateTaskMutation} = useMutation({
    mutationFn: useUpdateTaskFull,
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['tasks', projectId]})}
  })
  const onTaskUpdate = async (e) => {
    e.preventDefault()
    const taskId = selectedTaskId
    const data = new FormData(e.target)
    for (const value of data.values()) {
      console.log(value);
    }
    for (const value of data.keys()) {
      console.log(value);
    }
    let dataObject: dataObjectType = {
      title:"",
      taskId:taskId,
      status:"",
      priority:"",
    }
    for(const pair of data.entries()){
      dataObject = {...dataObject, [pair[0]]: pair[1]}
      // or dataObject[key] = value
    }
    updateTaskMutation({...dataObject})
    closeModal();
  }

// the reason why line 86 is label wrapper is cause generic div hindi siya nest
  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen gap-5 xl:text-sm xl:flex-col xl:p-5 box-border'>
      
      <dialog ref={dialogRef} className='rounded-2xl w-1/2 min-h-1/2 backdrop:bg-black/80 bg-primary-bg0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-hidden'>
        <div className='w-full h-auto flex flex-col p-10 self-center items-center text-white'>
          <h1 className='task-group-title'>Create Task</h1>
          <form className='w-full h-auto flex flex-col gap-5' onSubmit={submitTodo}>
            <div className='flex flex-col'>
              <label>Title</label>
              <input type='text' name='title' required className='input-types bg-primary-bg1 shadow-sm shadow-black'></input>
            </div>

            <div className='flex flex-col'> 
            <label>Priority</label>
            <div className='flex gap-5 justify-left'>
                <label className='flex flex-col bg-primary-bg1 rounded-lg text-white flex-1 hover:bg-primary-bg3 shadow-black shadow-sm'>
                  <input type='radio' value="low"  name='priority'  className='hidden peer' />
                  <span className="p-5 sm:p-2 w-full h-full peer-checked:bg-green-500 peer-checked:rounded-lg transition-colors  ">Low</span>
                </label>
                <label className='flex flex-col bg-primary-bg1 rounded-lg text-white flex-1 hover:bg-primary-bg3'>
                  <input type='radio' value="medium" name='priority' className='hidden peer'/>
                  <span className="p-5 sm:p-2 w-full h-full peer-checked:bg-yellow-400 peer-checked:rounded-lg shadow-black shadow-sm transition-colors ">Medium</span>
                </label >
                <label className='flex flex-col bg-primary-bg1 rounded-lg text-white flex-1  hover:bg-primary-bg3'>
                  <input type='radio'value="high" name='priority' className='hidden peer'/>
                  <span className="p-5 sm:p-2 w-full h-full peer-checked:bg-red-400  peer-checked:rounded-lg  shadow-black shadow-sm transition-colors">High</span>
                </label>
              </div>
            </div>

            <div className='flex flex-col gap-2 '>
              <label>Status</label>
              <select name='status'  className='w-1/2 text-white bg-primary-bg2 hover:bg-primary-bg2 rounded-sm shadow-black shadow-sm'>
                <option className='' value="todo">Todo</option>
                <option className='' value="in-progress">In-Progress</option>
                <option className='' value="review">To Review</option>
                <option className='' value="done">Done</option>
              </select>
            </div>
            <div className='flex justify-evenly flex-grow items-end gap-5'>
              <button type='submit' className='w-1/2  sm:p-1 bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'>Add</button>
              <button className='w-1/2  sm:p-1 bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' onClick={(e)=>{e.preventDefault(); dialogRef.current?.close()}}>Cancel</button>
            </div>
          </form>
        </div>
      </dialog>


      <dialog ref={dialogRefUpdate} className='rounded-2xl w-1/2 min-h-1/2 backdrop:bg-black/80 bg-primary-bg0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-hidden'>
        <div className='w-full h-auto flex flex-col p-10 self-center items-center text-white'>
          <h2>{selectedTaskId}</h2>
          <h1 className='task-group-title'>Update Task</h1>
          <form className='w-full h-auto flex flex-col gap-5' onSubmit={(e)=>{onTaskUpdate(e)}}>
            <div className='flex flex-col'>
              <label>Title</label>
              <input type='text' name='title' defaultValue={selectedTitle} required className='input-types bg-primary-bg1 shadow-sm shadow-black'></input>
            </div>

            <div className='flex flex-col'> 
            <label>Priority</label>
            <div className='flex gap-5 justify-left'>
                <label className='flex flex-col bg-primary-bg1 rounded-lg text-white flex-1 hover:bg-primary-bg3 shadow-black shadow-sm'>
                  <input type='radio' checked={selectedPriority === 'low'} value="low"  name='priority' className='hidden peer' />
                  <span className="p-5 sm:p-2 w-full h-full peer-checked:bg-green-500 peer-checked:rounded-lg transition-colors  ">Low</span>
                </label>
                <label className='flex flex-col bg-primary-bg1 rounded-lg text-white flex-1 hover:bg-primary-bg3'>
                  <input type='radio' checked={selectedPriority === 'medium'} value="medium" name='priority' className='hidden peer'/>
                  <span className="p-5 sm:p-2 w-full h-full peer-checked:bg-yellow-400 peer-checked:rounded-lg shadow-black shadow-sm transition-colors ">Medium</span>
                </label >
                <label className='flex flex-col bg-primary-bg1 rounded-lg text-white flex-1  hover:bg-primary-bg3'>
                  <input type='radio' checked={selectedPriority === 'high'} value="high" name='priority' className='hidden peer'/>
                  <span className="p-5 sm:p-2 w-full h-full peer-checked:bg-red-400  peer-checked:rounded-lg  shadow-black shadow-sm transition-colors">High</span>
                </label>
              </div>
            </div>

            <div className='flex flex-col gap-2 '>
              <label>Status</label>
              <select name='status' defaultValue={selectedStatus} className='w-1/2 text-white bg-primary-bg2 hover:bg-primary-bg2 rounded-sm shadow-black shadow-sm'>
                <option className='' value="todo">Todo</option>
                <option className='' value="in-progress">In-Progress</option>
                <option className='' value="review">To Review</option>
                <option className='' value="done">Done</option>
              </select>
            </div>
            <div className='flex justify-evenly flex-grow items-end gap-5'>
              <button type='submit' className='w-1/2  sm:p-1 bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'>Update</button>
              <button className='w-1/2  sm:p-1 bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' onClick={()=>closeModal()}>Cancel</button>
            </div>
          </form>
        </div>
      </dialog>



      {hasAccess ? (
      <>
        {errorC && <ErrorComponent errorC={errorC}></ErrorComponent>}
        <div className='shadow-black shadow-lg font-Monsterrat flex flex-col max-h-screen bg-primary-bg1 justify-between xl:flex-row sm:flex-wrap xl:w-full xl:min-h-0 xl:justify-around sm:text-xs sm:'>
          <button className='left-panel-tab w-full p-4 flex-auto sm:w-1/3' onClick={()=>{setContent(Content.Main)}}><GrProjects/><span className='xlreverse:hidden font-bold'>Project</span></button>
          <button className='left-panel-tab w-full p-4 flex-auto bg-primary-bg2 sm:w-1/3' onClick={()=>{setContent(Content.People)}}><IoPeopleSharp/><span className='xlreverse:hidden font-bold'>Members</span></button>
          <button className='left-panel-tab w-full p-4 flex-auto sm:w-1/3' onClick={()=>{setContent(Content.Settings)}}><IoSettingsSharp/><span className='xlreverse:hidden font-bold'>Settings</span></button>
          <button className='left-panel-tab w-full p-4 flex-auto bg-primary-bg2 sm:w-1/3' onClick={()=>{setContent(Content.WhiteBoard)}}><FaExternalLinkSquareAlt/><span className='xlreverse:hidden font-bold'>Links</span></button>
          <button className='left-panel-tab w-full p-4 flex-auto sm:w-1/3' onClick={()=>{setContent(Content.Specifications)}}><IoDocumentTextSharp/><span className='xlreverse:hidden font-bold'>Specification</span></button>
        </div>
        <div className='flex flex-1 flex-col xl:items-center gap-5 '>
          <div className='flex w-3/4 mt-2'>
            <Link to="/main" className='flex-1'><IoMdArrowRoundBack className='text-xl relative -left-9 rounded-full text-white mx-10'/></Link>
            <h1 className=' flex-1 text-2xl text-center place-self-center bg-primary-bg1 text-white rounded-3xl font-extralight shadow-black shadow-sm font-extralight '>Home Problems</h1>
            <div className='flex-1'></div>
          </div>
          
            <MemberRoleProvider myRole={myRole} setMyRole={setMyRole}>
          {content === Content.Main && <ColumnContainer dialogRef={dialogRef}/>}
          {content === Content.People && <People/>}
          {content === Content.Settings && <Settings/>}
          {content === Content.Specifications && <Specifications/>}
          {content === Content.WhiteBoard && <WhiteBoard/>}
            </MemberRoleProvider> 
        </div>


      </>) : <div>You are not part of a project</div>}
  </div>
  )
}

export default ProjectPage