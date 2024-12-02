import { useEffect , useState, useContext} from 'react'
import TaskContainer from '../components/TaskFolder/TaskContainer'
import LeftPanelNavigation from '../components/LeftPanelNavigation'
import { axiosInstance } from '../axios/axios'
import { useParams } from 'react-router-dom'
import { ErrorComponent, ErrorContext } from '../context/ErrorContext'
import { AxiosError } from 'axios'

function ProjectPage() {
  const {errorC, setErrorC} = useContext(ErrorContext)
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams();
  const projectId = params.projectId;
  console.log(projectId + "PPPPPPPPPPPPPPPPP");
  useEffect(()=> {
    const getQuery = async () => {
      try{
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/verifyProjectAccess`, {projectId: projectId});
        if(result.status === 200){
          console.log(result.data.data);
          setHasAccess(result.data.data)
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

  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen gap-5'>

      {hasAccess ? (
      <>
        <ErrorComponent errorC={errorC}></ErrorComponent>
        <div className='flex flex-col min-h-screen bg-primary-bg1 w-1/12 justify-end'>
          <button className='left-panel-tab'>Projects</button>
          <button className='left-panel-tab'>People</button>
          <button className='left-panel-tab'>Settings</button>
          <button className='left-panel-tab'>Links</button>
          <button className='left-panel-tab'>Specifications</button>
        </div>
        <div className='flex flex-1 flex-col items-center gap-5'>
          <h1 className='text-2xl font-bold'>Olympiad: Triangle of Software</h1>
          <TaskContainer/>
        </div>

        <LeftPanelNavigation/>
      </>) : <div>You are not part of a project</div>}
  </div>
  )
}

export default ProjectPage