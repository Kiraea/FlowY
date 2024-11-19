import React from 'react'
import {useState} from 'react'
import Header from '../components/Header'
import { TiUserAdd } from "react-icons/ti";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from 'react-router-dom';
import { IoRemove } from "react-icons/io5";
import ErrorLabel from '../components/ErrorLabel';

function CreateProjectPage() {
    const [errorLabel, setErrorLabel] = useState('')
    const [projectName, setProjectName] = useState('')
    const [projectDesc, setProjectDesc] = useState('')
    const [projectSpecs, setProjectSpecs] = useState('')
    const [memberName, setMemberName] = useState('')
    const [memberList, setMemberList] = useState<string[]>([])

    const addMember = (e: React.FormEvent<HTMLButtonElement>)=>{
      e.preventDefault()
      setMemberList((prev)=>{
        return [...prev, memberName]
      })
    }
    const removeMember = (e: React.FormEvent<HTMLButtonElement>, memberName:string)=>{
      e.preventDefault()
      setMemberList(memberList.filter((member)=>{
        return member.toLowerCase() !== (memberName.toLowerCase())
      }))
    }

  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen items-center  flex-col gap-y-5'>

        <Header/>
        <div className='w-1/2'>
          <Link to='/main'><button className='bg-primary-highlight2 text-black rounded-3xl p-1'><MdKeyboardDoubleArrowLeft/></button></Link>
        </div>
        <form className='w-1/2 bg-primary-bg1 p-5 flex flex-col gap-5 rounded-xl'>
            <div className='flex flex-col'>
              <label>Project Name</label>
              <input type='text' name='projectName' value={projectName} onChange={(e)=>{setProjectName(e.target.value)}} className='input-types p-0'/>
            </div>

            <div className='flex flex-col'>
              <label>Project Description</label>
              <input type='text' name='projectDesc'value={projectDesc} onChange={(e)=>{setProjectDesc(e.target.value)}} className='input-types p-0'/>
            </div>
            <div className='flex flex-col'>
              <label>Project Specs</label>
              <textarea value={projectSpecs} name='projectSpecs' onChange={(e)=>{setProjectSpecs(e.target.value)}} className='text-black focus:outline-none bg-primary-bg3 text-white p-1'/>
            </div>
            <div className='flex gap-5 self-start '>
              <input type='text' value={memberName} onChange={(e)=>{setMemberName(e.target.value)}} className='text-white bg-primary-bg3 p-1'/>
              <button onClick={addMember} className='flex gap-2px items-center'><TiUserAdd className='text-2x'/> Add Members</button>
            </div>
            <ul className='flex flex-col'>
              {memberList.map((member)=>{
                return (
                  <li className='flex gap-3'>
                    <div className='bg-primary-bg0 mt-1 w-fit p-2 rounded-xl'>{member}</div>
                    <button onClick={(e)=>{removeMember(e, member)}}><IoRemove/></button>
                  </li>
                )
              })}
            </ul>
            <button type='submit' className='bg-primary-highlight2 w-fit rounded-xl p-1 text-black'>Submit</button>
        </form>
        <ErrorLabel errorLabel={errorLabel}/>
    </div>
  )
}

export default CreateProjectPage