import React from 'react'

function LeftPanelNavigation() {
  return (
    <div className='flex min-h-screen flex-col items-center p-1 py-5 gap-5 bg-primary-bg1 border-primary-bg0 border-l-2 w-1/5 xl:w-full xl:min-h-0 '>
      <div className='w-5/6 h-5/6 bg-primary-bg0'></div>
      <div className='flex flex-row justify-end w-5/6'>
        <button className='bg-primary-bg1 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'>Send</button>
      </div>
    </div>
  )
}

export default LeftPanelNavigation