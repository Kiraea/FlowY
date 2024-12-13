import React from 'react'
import { useGetAllProjectMembersByProjectId } from '../../hooks/QueryHooks'
import { useParams } from 'react-router-dom'
function PeopleContainer() {
  const params = useParams()
  const projectId = params.projectId || "";

  const {data,isLoading, isError, error} = useGetAllProjectMembersByProjectId(projectId)
    
  if(isLoading){
    return <div>isLoading...</div>
  }
  if(isError){
    return <div>{error.message}</div>
  }
  



  return (
    <div className='w-full flex flex-col'>
      <div>
        <button className=' bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' ><span className='text-xl font-bold'>Add Member</span></button>
      </div>

      <div>
      </div>

    </div>
  )
}

export default PeopleContainer