import React from 'react'
import Header from '../components/Header'
import ProjectContainer from '../components/ProjectContainer'
function MainPage() {
  return ( 
    <div className='text-white flex bg-primary-bg0 min-h-screen flex-col gap-y-10 items-center'>
        <Header/>
        <ProjectContainer/>
        
    </div>
  )
}

export default MainPage