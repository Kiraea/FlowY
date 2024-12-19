import React from 'react'


import { FaUser } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
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
    <div className='flex flex-col items-start bg-primary-bg1 p-2 gap-5 relative h-full hover:bg-primary-bg2 shadow-black shadow-md'>
        <div className='flex flex-col items-start basis-10/12 gap-5' >
          <h1 className='font-bold bg-primary-bg3 p-1 rounded'>{project.name}</h1>
          <h2 className='' >{truncated}</h2>
        </div>

        <div className='flex-1 flex w-full border-t-2 border-primary-bg3 mb-auto p-2'>
            <span className='p-1 text-primary-bg4'>{project.created_at_formatted}</span> 
            <div className='flex flex-1 justify-end items-center'>
              {Array.from({length: parseInt(project.member_count)}).map((_,index)=> {
                return <FaUser className={` ${index < 3 ? 'text-red-400' : 'text-red-300'} `}/>
              })}
            </div>
        </div>

    </div>
  )
}

export default Project