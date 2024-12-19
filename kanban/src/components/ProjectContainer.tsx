import React from 'react'
import Project from './Project'
import { Link } from 'react-router-dom'
import { useGetProjects } from '../hooks/QueryHooks'
type ProjectProps = {
  project: {
    created_at_formatted: string,
    description: string,
    github_link: string,
    id: number,
    name: string,
    specifications: string,
    member_count: string,
  }
}
function ProjectContainer() {
  const {error, data:projects, isLoading, isError} = useGetProjects();

  if (isLoading){
    return <div>...loading Projects</div>
  }

  if(isError){
    return <div>{error.message}</div>
  }


  return (
    <div className='w-5/6'>
      <Link to='/createproject'><button className=' shadow-black shadow-sm bg-primary-bg1 hover:bg-primary-bg2 rounded-lg p-2 mb-5'><span className='text-l'>Create  <span className='text-red-300'>New Project</span></span></button></Link>
      <div className='grid-cols-3 grid gap-8 sm:grid-cols-1 lg:grid-cols-2'>
        {projects?.length > 0 && projects.map((project: ProjectProps['project'])=> {
          return <Link to={`/project/${project.id}`}><Project project={project} key={project.id}/></Link>
        })}
      </div>
  </div>
  )
}

export default ProjectContainer