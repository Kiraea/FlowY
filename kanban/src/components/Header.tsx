import React from 'react'
import { RiFlowChart } from "react-icons/ri"
import { GiCrossedAirFlows } from "react-icons/gi";
import { FaUser } from "react-icons/fa6";

function Header() {
  return (
    <div className='flex justify-between items-center bg-primary-bg0 p-5 w-full'>
        <div className='flex items-center'>
            <div className='font-Inter text-primary-white font-bold text-5xl'>FlowY</div>
            <GiCrossedAirFlows className='size-8 text-primary-highlight2'/>
        </div>
        <div className='flex flex-col items-center'>
            <FaUser className='size-8'/>
            <div className='text-center'>Welcome, Kira!</div>
        </div>
    </div>
  )
}

export default Header