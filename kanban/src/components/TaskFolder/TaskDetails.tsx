import React from 'react'
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";

const colorsMap = {
    red: '#fe2712',
    yellow: '#fefe33',
    blue: '#0247fe'
}
function TaskDetails() {
  return (
    <div className='flex flex-col items-center justify-center relative border-primary-bg3 border-b-2 hover:bg-primary-highlight2 hover:border-primary-highlight2 transition-all duration-75'>
        <div>Title: Feature </div>
        <div>Priority: Medium</div>
        <div>Assigned to: John </div>
        <div>Tags/Labels: Bug</div>
    </div>
  )
}

export default TaskDetails