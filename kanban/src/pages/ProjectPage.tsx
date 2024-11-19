import React from 'react'
import TaskContainer from '../components/TaskFolder/TaskContainer'
import LeftPanelNavigation from '../components/LeftPanelNavigation'

function ProjectPage() {
  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen gap-5'>


      <div className='flex flex-col min-h-screen bg-primary-bg1 w-1/12 justify-end'>
          <button className='left-panel-tab'>Projects</button>
          <button className='left-panel-tab'>People</button>
          <button className='left-panel-tab'>Settings</button>
          <button className='left-panel-tab'>Links</button>
          <button className='left-panel-tab'>Specifications</button>
      </div>


      <div className='flex flex-1 flex-col items-center gap-5'>
        <h1 className='text-2xl font-bold'>Olympiad: Triangle of Software</h1>
        <TaskContainer/>
      </div>

      <LeftPanelNavigation/>


    </div>
  )
}

export default ProjectPage