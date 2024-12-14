import React from 'react'
import { useContext } from 'react'
import { useAddProjectMember, useGetAllProjectMembersByProjectId } from '../../hooks/QueryHooks'
import { useParams } from 'react-router-dom'
import PeopleCard from './PeopleCard'
import { useUpdateProjectMemberRole } from '../../hooks/QueryHooks'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient} from '@tanstack/react-query'
import { MemberRoleContext } from '../../context/MemberRoleContext'
import { useRef } from 'react'

function PeopleContainer() {
  const dialogRefAddMember = useRef<HTMLDialogElement | null>(null)
  const {myRole, setMyRole} = useContext(MemberRoleContext)
  const params = useParams()
  const projectId = params.projectId || "";

  const queryClient = useQueryClient()
  const {isError: isErrorProjectMembers, isLoading: isLoadingProjectMembers, error: errorProjectMembers, data: projectMembers} = useGetAllProjectMembersByProjectId(projectId) 



  const {mutateAsync: updateProjectMemberRoleMutation} = useMutation({
    mutationFn: useUpdateProjectMemberRole,
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['projectMembers', projectId]})}
  })


  const handleUpdateMemberRole = (memberId: string, role: string)=>{
    updateProjectMemberRoleMutation({projectId, role, memberId})
  }




   const {mutateAsync: handleAddMemberMutation} = useMutation({
    mutationFn: useAddProjectMember,
    onSuccess: () => {
      console.log(projectId)
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
      console.log("QUERY INVALIDATED and REFETCHED");
    }
  })

  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    let object: {projectId: string; [key:string]: string} = {
      projectId: projectId,
    }

    for (let pair of formData.entries()){
      object[pair[0]] = pair[1] as string;
    }
    handleAddMemberMutation({projectId: object.projectId, displayName: object.displayName})
    dialogRefAddMember.current?.close();
  }

  if(isLoadingProjectMembers){
    return <div>isLoading...</div>
  }
  if(isErrorProjectMembers){
    return <div>{errorProjectMembers?.message}</div>
  }
  return (
    <div className='w-full flex flex-col gap-4 pr-5'>
     <dialog ref={dialogRefAddMember} className='rounded-2xl w-1/2 min-h-1/2 backdrop:bg-black/80 bg-primary-bg0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-hidden'>
        <div className='w-full h-auto flex flex-col p-10 self-center items-center text-white'>
          <h1 className='task-group-title'>Add Member</h1>
          <form className='w-full h-auto flex flex-col gap-5' onSubmit={handleAddMember}>
            <div className='flex flex-col'>
              <label>Dispay Name</label>
              <input type='text' name='displayName' required className='input-types bg-primary-bg1 shadow-sm shadow-black'></input>
            </div>

            <div className='flex justify-evenly flex-grow items-end gap-5'>
              <button type='submit' className='w-1/2  sm:p-1 bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'>Add</button>
              <button className='w-1/2  sm:p-1 bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm' onClick={(e)=>{e.preventDefault(); dialogRefAddMember.current?.close()}}>Cancel</button>
            </div>
          </form>
        </div>
      </dialog>
    
      <div>
        {myRole !== 'member' && <button className='bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'  onClick={()=>dialogRefAddMember.current?.showModal()} ><span className='text-xl font-bold'>Add Member</span></button>}
      </div>
      <div className='bg-primary-bg1 rounded-xl p-5 flex flex-col gap-5 shadow-black shadow-md '>
        <div className='px-20 grid grid-cols-3 text-xl rounded-xl font-bold  '>
          <span>Name</span>
          <span>Role</span>
          <span>ChangeRole</span>
        </div>
      </div>
      <div className='bg-primary-bg2 rounded-xl p-5 flex flex-col gap-5 shadow-black shadow-md '>
        {projectMembers.map((member)=> {
           return  (<PeopleCard key={member.member_id} handleUpdateMemberRole={handleUpdateMemberRole} displayName={member.display_name} memberRole={member.role} memberId={member.member_id} />)
        })}
      </div>

    </div>
  )
}

export default PeopleContainer