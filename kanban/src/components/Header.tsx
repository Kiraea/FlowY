import React from 'react'
import { RiFlowChart } from "react-icons/ri"
import { GiCrossedAirFlows } from "react-icons/gi";
import { FaUser } from "react-icons/fa6";
import { AxiosInstance } from 'axios';
import { useUserData } from '../hooks/QueryHooks';

function Header() {
  const {data, isPending, isError, error} = useUserData()
  if (isPending){
    return <div>Is Loading ...</div>
  }
  if (isError){
    return <div>ERROR: {error.message}</div>
  }

  return (
    <div className='shadow-black shadow-lg flex justify-between items-center bg-primary-bg0 p-5 w-full'>
        <div className='flex items-center'>
            <div className='font-Inter text-primary-white font-bold text-5xl'>FlowY</div>
            <GiCrossedAirFlows className='size-8 text-red-300'/>
        </div>
        <div className='flex flex-col items-center'>
            <FaUser className='size-8'/>
            <div className='text-center'>Welcome <span className='text-red-300 font-bold bg-primary-bg2 rounded-md p-1'>{data.displayName}</span></div>
        </div>
    </div>
  )
}

export default Header