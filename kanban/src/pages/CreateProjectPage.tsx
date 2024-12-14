import React from 'react'
import {useState, useContext} from 'react'
import Header from '../components/Header'
import { TiUserAdd } from "react-icons/ti";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from 'react-router-dom';
import { IoRemove } from "react-icons/io5";
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';


import { axiosInstance } from '../axios/axios';
import {ErrorContext, ErrorComponent} from '../context/ErrorContext';
import { useMutation } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
type ProjectDetailsType = {
  name: string,
  specifications: string,
  description: string,
  link: string,
  members?: string[]
}

function CreateProjectPage() {


  const navigate = useNavigate()
  const {errorC, setErrorC} = useContext(ErrorContext)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [projectSpecs, setProjectSpecs] = useState('')
  const [projectLink, setProjectLink] = useState('')
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
  const submitProjectDetails = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let isError = false;
    let projectDetails: ProjectDetailsType = {
      name: projectName,
      description: projectDesc,
      link: projectLink,
      specifications: projectSpecs,
    }
    if (memberList.length > 0 ){
        projectDetails = {...projectDetails, members:memberList}
    }
    if (Object.values(projectDetails).some((value)=>(value === ''))){
      console.log("dakoda");
      isError=true;
      setErrorC("Fields are incomplete, Please try again");
    }
    if (!isError){
      try{
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/createProject`,{projectDetails})
        if(result.status === 200){
          console.log(result.data.message);
          console.log(result.data.data);
          navigate(`/main`);
      }
      }catch(e: unknown){
          if (e instanceof AxiosError){
            setErrorC(e.response?.data.error);
        }
      }

    }
  }

  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen items-center  flex-col gap-y-5'>

        <Header/>
        <div className=''>
        </div>
        <form className=' bg-primary-bg1 p-5 flex flex-col gap-5 rounded-xl relative'>
              <Link to='/main'><button className='absolute -top-10 left-0 bg-primary-highlight2 text-black rounded-3xl p-1'><MdKeyboardDoubleArrowLeft/></button></Link>
            <div className='flex flex-col'>
              <label>Project Name</label>
              <input type='text' required name='projectName' value={projectName} onChange={(e)=>{setProjectName(e.target.value)}} className='input-types p-0'/>
            </div>

            <div className='flex flex-col'>
              <label>Project Description</label>
              <input type='text' required name='projectDesc'value={projectDesc} onChange={(e)=>{setProjectDesc(e.target.value)}} className='input-types p-0'/>
            </div>
            <div className='flex flex-col'>
              <label>Project Specs</label>
              <textarea value={projectSpecs} required name='projectSpecs' onChange={(e)=>{setProjectSpecs(e.target.value)}} className='text-black focus:outline-none bg-primary-bg3 text-white p-1'/>
            </div>
            <div className='flex flex-col'>
              <label>Project Link <span className='text-primary-bg3'> (Optional) </span></label>
              <textarea value={projectLink} placeholder='https://github.com/KallavanIVCT/MOBDEVE'name='projectLink' onChange={(e)=>{setProjectLink(e.target.value)}} className='text-black focus:outline-none bg-primary-bg3 text-white p-1'/>
            </div>
            <div className='flex gap-5'>
              <input type='text' placeholder="JohnWick"value={memberName} onChange={(e)=>{setMemberName(e.target.value)}} className='text-white bg-primary-bg3 p-1'/>
              <button onClick={addMember} className='flex gap-2px items-center'><TiUserAdd className='text-5xl sm:text-3xl'/><span className='md:hidden'>Add Members</span></button>
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
            <button onClick={submitProjectDetails} className='bg-primary-highlight2 w-fit rounded-xl p-1 text-black'>Submit</button>
        </form>
        <ErrorComponent errorC={errorC}/>
    </div>
  )
}

export default CreateProjectPage