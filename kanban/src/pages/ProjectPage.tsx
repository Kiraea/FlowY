import { useEffect , useState, useContext} from 'react'
import LeftPanelNavigation from '../components/LeftPanelNavigation'
import { axiosInstance } from '../axios/axios'
import { useParams } from 'react-router-dom'
import { ErrorComponent, ErrorContext } from '../context/ErrorContext'
import { AxiosError } from 'axios'
import Settings from '../components/content/Settings'
import Specifications from '../components/content/Specifications'
import Links from '../components/content/Links'
import People from '../components/content/People'
import ColumnContainer from '../components/TaskFolder/ColumnContainer'
import { TfiControlBackward } from "react-icons/tfi";
import { Link } from 'react-router-dom'
enum Content{

  Main = 'Main',
  People = 'People',
  Settings = 'Settings',
  Links = 'Links',
  Specifications = 'Specifications'
}

function ProjectPage() {
  const {errorC, setErrorC} = useContext(ErrorContext)
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<Content>(Content.Main);


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
    <div className='text-white flex bg-primary-bg0 min-h-screen gap-5 xl:text-sm xl:flex-col xl:p-5'>

      {hasAccess ? (
      <>
        {errorC && <ErrorComponent errorC={errorC}></ErrorComponent>}
        <div className='flex flex-col min-h-screen bg-primary-bg1 w-1/12 justify-end xl:flex-row xl:w-full xl:min-h-0 xl:justify-around'>
          <button className='left-panel-tab w-full' onClick={()=>{setContent(Content.Main)}}>Projects</button>
          <button className='left-panel-tab w-full' onClick={()=>{setContent(Content.People)}}>People</button>
          <button className='left-panel-tab w-full' onClick={()=>{setContent(Content.Settings)}}>Settings</button>
          <button className='left-panel-tab w-full' onClick={()=>{setContent(Content.Links)}}>Links</button>
          <button className='left-panel-tab w-full' onClick={()=>{setContent(Content.Specifications)}}>Specifications</button>
        </div>
        <div className='flex flex-1 flex-col items-center gap-5'>
          <div className='flex justify-between items-center'>
            <Link to="/main"><TfiControlBackward/></Link>
            <h1 className='text-2xl font-bold'>Olympiad: Triangle of Software</h1>
          </div>

          {content === Content.Main && <ColumnContainer/>}
          {content === Content.People && <People/>}
          {content === Content.Settings && <Settings/>}
          {content === Content.Specifications && <Specifications/>}
          {content === Content.Links && <Links/>}
        </div>

        <LeftPanelNavigation/>
      </>) : <div>You are not part of a project</div>}
  </div>
  )
}

export default ProjectPage