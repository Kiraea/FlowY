import React from 'react'
import { FaUser } from "react-icons/fa6";
function Project() {
  return (
    <div className='flex flex-col items-center bg-primary-bg1 p-5 gap-5 relative'>
        <h1>Project</h1>
        <h2>Lorem ipsum dol, odit quas fadjwaidawijdwaj idjwa djiawjdi djawij diwaj diwacere ducimus accusamus aliquid.</h2>
        <div className='flex items-center absolute bottom-3 right-4'>
            <div className='text-right'>5</div>
            <FaUser className='text-primary-contrast'/>
        </div>
    </div>
  )
}

export default Project