import React from 'react'


import { FaUser } from "react-icons/fa6";
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
function Project({project}: ProjectProps) {


  const truncated = project.description.length > 200 ? project.description.slice(0,200) + '...' : project.description

  console.log(project);
  return (
    <div className='flex flex-col items-center bg-primary-bg1 p-2 gap-5 relative h-full'>
        <h1 className='font-bold '>{project.name}</h1>
        <h2 className='' >{truncated}</h2>
        <div className='flex w-full border-t-2 border-primary-bg3 mb-auto p-2'>

            <span className=''>{project.created_at_formatted}</span> 
            <div className='flex flex-1 justify-end items-center'>
              <div>{project.member_count}</div>
              <FaUser className='text-primary-contrast'/>
            </div>
        </div>
    </div>
  )
}

export default Project