import React from 'react'
import { useContext } from 'react'
import { useGetAllProjectMembersByProjectId } from '../../hooks/QueryHooks'
import { useParams } from 'react-router-dom'
import PeopleCard from './PeopleCard'
import { ProjectMembersContext } from '../../context/ProjectMembersContext'
import { useUpdateProjectMemberRole } from '../../hooks/QueryHooks'
import { useMutation } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { MemberRoleContext } from '../../context/MemberRoleContext'
function PeopleContainer() {

  const {myRole, setMyRole} = useContext(MemberRoleContext)
  console.log("RE RENDER");
  const params = useParams()
  const projectId = params.projectId || "";

  const queryClient = new QueryClient()
  const {isErrorProjectMembers, isLoadingProjectMembers, errorProjectMembers, projectMembers} = useContext(ProjectMembersContext);
  if(isLoadingProjectMembers){
    return <div>isLoading...</div>
  }
  if(isErrorProjectMembers){
    return <div>{errorProjectMembers?.message}</div>
  }


  const {mutateAsync: updateProjectMemberRoleMutation} = useMutation({
    mutationFn: useUpdateProjectMemberRole,
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['projectMembers', projectId]})}
  })


  const handleUpdateMemberRole = (memberId: string, role: string)=>{
    updateProjectMemberRoleMutation({projectId, role, memberId})
  }


  return (
    <div className='w-full flex flex-col gap-4 pr-5'>
      <div>
        {myRole !== 'member' && <button className=' bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' ><span className='text-xl font-bold'>Add Member</span></button>}
      </div>
      <div className='bg-primary-bg1 rounded-xl p-5 flex flex-col gap-5 shadow-black shadow-md '>
        <div className='px-20 grid grid-cols-3 text-xl rounded-xl font-bold  '>
          <span>Name</span>
          <span>Role</span>
          <span>ChangeRole</span>
        </div>
      </div>
      <div className='bg-primary-bg2 rounded-xl p-5 flex flex-col gap-5 shadow-black shadow-md'>
        {projectMembers.map((member)=> {
           return  (<PeopleCard key={member.member_id} handleUpdateMemberRole={handleUpdateMemberRole} displayName={member.display_name} memberRole={member.role} memberId={member.member_id} />)
        })}
      </div>

    </div>
  )
}

export default PeopleContainer