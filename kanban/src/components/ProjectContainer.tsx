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
    <div className='w-3/4'>
      <Link to='/createproject'><button className='bg-primary-highlight2 rounded-lg p-2 mb-5'><span className='text-l'>Create New Project</span></button></Link>
      <div className='grid-cols-2 grid gap-5 sm:grid-cols-3'>
        {projects?.length > 0 && projects.map((project: ProjectProps['project'])=> {
          return <Project project={project} key={project.id}/>
        })}
      </div>
  </div>
  )
}

export default ProjectContainer