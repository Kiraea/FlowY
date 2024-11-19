import React from 'react'
import Project from './Project'
import { Link } from 'react-router-dom'
function ProjectContainer() {
  return (
    <div className='w-3/4'>
      <Link to='/createproject'><button className='bg-primary-highlight2 rounded-lg p-2 mb-5'><span className='text-l'>Create New Project</span></button></Link>
      <div className='grid-cols-2 grid gap-5 sm:grid-cols-3'>
        <Project/>
        <Project/>
        <Project/>
        <Project/>
        <Project/>
        <Project/>
      </div>
  </div>
  )
}

export default ProjectContainer