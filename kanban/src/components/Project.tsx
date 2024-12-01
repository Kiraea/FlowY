import React from 'react'
import { FaUser } from "react-icons/fa6";
type ProjectProps = {
  project: {
    created_at: string,
    description: string,
    github_link: string,
    id: number,
    name: string,
    specifications: string
  }
}
function Project({project}: ProjectProps) {
  console.log(project);
  return (
    <div className='flex flex-col items-center bg-primary-bg1 p-5 gap-5 relative'>
        <h1>{project.name}</h1>
        <h2>{project.description}</h2>
        <div className='flex items-center absolute bottom-3 right-4'>
            <div className='text-right'>5</div>
            <FaUser className='text-primary-contrast'/>
        </div>
    </div>
  )
}

export default Project