import React from 'react'
import { useGetSpecificProject } from '../../hooks/QueryHooks'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useEffect } from 'react';
import { usePatchProjectDetails } from '../../hooks/QueryHooks';
function Specifications() {

  const params = useParams();
  const projectId = params.projectId || ''; 
  const {data, isLoading, error, isError} = useGetSpecificProject(projectId)

  const {usePatchProjectDetailsAsync}= usePatchProjectDetails()

  useEffect(() => {
    if (!isLoading && data){
      console.log("new data");
      setModifiedProjectDetails((prev) => ({...prev, 
        githubLink: data[0].github_link || '',
        name: data[0].name || '',
        description: data[0].description|| '',
        specifications: data[0].specifications || '',
      }));
    }
  }, [data, isLoading])


  const [modifiedProjectDetails, setModifiedProjectDetails] = useState({
    githubLink: "",
    name: "",
    specifications: "",
    description: ""
  })

  const inputProjectDialogBox = useRef<HTMLDialogElement | null>(null)
  

  const openProjectDialogBox = () => {
    inputProjectDialogBox.current?.showModal()
  }
  const closeProjectDialogBox = () => {
    inputProjectDialogBox.current?.close()
  }

  if (isLoading){
    return <div>...isLoading</div>
  }

  const handleUpdateProjectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setModifiedProjectDetails((prev) => ({...prev, [name]: value}))
  }

  const submitUpdateProjectInput = () => {
    usePatchProjectDetailsAsync({ projectDetails:modifiedProjectDetails, projectId})
  }


  return (
    <div className='w-full flex flex-col gap-4 pr-5'>

      <dialog ref={inputProjectDialogBox} className="absolute m-auto shadow-gray shadow-lg rounded-lg">
          <div className="flex flex-col p-5 gap-2 bg-primary-bg1  text-gray-100 ">
              <IoMdCloseCircle className="absolute top-2 right-2 text-gray-300" onClick={closeProjectDialogBox}/>
              <label className="font-medium"> Github_Link </label>
              <input onChange={handleUpdateProjectInput} name='githubLink' value={modifiedProjectDetails.githubLink} className=" bg-primary-bg2 rounded-xl p-2 text-xs" type="text" placeholder="Bought Eggs"/>
              <label className="font-medium"> Description </label>                 
              <input onChange={handleUpdateProjectInput} name='description' value={modifiedProjectDetails.description} className=" bg-primary-bg2 rounded-xl p-2 text-xs" type="text" placeholder="Bought Eggs"/>
              <label className="font-medium"> Specifications</label>
              <input onChange={handleUpdateProjectInput} name='specifications' value={modifiedProjectDetails.specifications} className=" bg-primary-bg2 rounded-xl p-2 text-xs" type="text"/>
              <label className="font-medium"> Title </label>
              <input onChange={handleUpdateProjectInput} name='name' value={modifiedProjectDetails.name} className=" bg-primary-bg2 rounded-xl p-2 text-xs" type="text"/>
              <div className="w-full flex justify-end">
                  <button onClick={submitUpdateProjectInput} className="bg-primary-bg1 p-2 text-xs shadow-black shadow-sm rounded-lg hover:bg-primary-bluegray" type="submit">Submit</button>
              </div>
          </div>
      </dialog>

      <div>
        <button className='bg-primary-bg2 rounded-xl p-5 shadow-black shadow-md' onClick={() => openProjectDialogBox()}>Edit Project Details</button>
      </div>

      <div className='bg-primary-bg2 rounded-xl p-5 flex flex-col gap-5'>
        {data[0].github_link !== null ? 
        <span className='text-2xl font-bold text-red-300'>Github: <span className='font-normal text-white'> {data[0].github_link}</span></span> : <span className='text-2xl font-bold'>Github Link: <span> N/A</span></span> }

        {data[0].description !== null ? 
        <span className='text-2xl font-bold text-green-300'>Description: <span className='font-normal text-white'> {data[0].description}</span></span> : <span className='text-2xl font-bold'>Description: <span> N/A</span></span> }

        {data[0].specifications !== null ? 
        <span className='text-2xl font-bold text-orange-300'>Specification: <span className='font-normal text-white'> {data[0].specifications}</span></span> : <span className='text-2xl font-bold'>Specifcation: <span> N/A</span></span> }


      </div>

    </div>

  )
}

export default Specifications