import e from 'express';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FaEraser } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
function WhiteBoard() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([])
  const [color, setColor ] = useState('#')
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)


  useEffect(()=> {
    console.log(drawingHistory.length);
    let canvas: HTMLCanvasElement | null = canvasRef.current
    if (canvas){

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const context = canvas.getContext("2d")
      if (context){
        context.lineCap = "round"
        context.lineWidth = 15
        context.strokeStyle = color



        contextRef.current = context

        drawingHistory?.forEach((imageData) => {
            contextRef.current?.putImageData(imageData,0,0)
        })

      } 
    }
  }, [drawingHistory, color])


  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {

    const {offsetX, offsetY} = e.nativeEvent as MouseEvent
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
    setIsDrawing(true)
    e.nativeEvent.preventDefault()
  }

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const {offsetX, offsetY} = e.nativeEvent
    if (!isDrawing) return
    contextRef.current?.lineTo(offsetX, offsetY)
    contextRef.current?.stroke()

    e.nativeEvent.preventDefault()

  }


  const mouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    contextRef.current?.closePath()

    e.nativeEvent.preventDefault()
    const imageData = contextRef.current?.getImageData(0,0, canvasRef.current?.width || 0 , canvasRef.current?.height || 0)

    if(imageData){
      setDrawingHistory((prev)=> [...prev, imageData])
    }

  }
  const undo =  () => {
    setDrawingHistory((prev) => prev.slice(0, prev.length - 1));
  }

  const mouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false)
    contextRef.current?.closePath()
    e.nativeEvent.preventDefault()
  }

  const setToErase = () => {
    if(contextRef.current){
      contextRef.current.globalCompositeOperation = 'destination-out'
    }
  }
  const setToDraw = () => {
    if(contextRef.current){
      contextRef.current.globalCompositeOperation = 'source-over'
    }
  }
  return (
      <div className='w-full h-full bg-transparent flex flex-col p-5' >
        <div className='w-full h-4/5'>
          <canvas ref={canvasRef}
          className='bg-primary-bg1 w-full h-full ' 
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseLeave}
          ></canvas>
        </div>
        <div className='w-full h-1/5 bg-primary-bg2 flex gap-5 p-5 '>
          <input type='color' className=' bg-transparent' value={color} onChange={(e)=> {setColor(e.target.value)}}></input>
          <button onClick={undo} className=' bg-primary-bg1 rounded-lg p-5  hover:bg-primary-bg2 shadow-black shadow-sm'>Undo</button>
          <button onClick={setToDraw} className='flex items-center justify-center p-5  bg-primary-bg1 rounded-lg  hover:bg-primary-bg2 shadow-black shadow-sm'>
            <FaPencilAlt/>
          </button>
          <button onClick={setToErase} className='flex items-center justify-center p-5  bg-primary-bg1 rounded-lg  hover:bg-primary-bg2 shadow-black shadow-sm'>
            <FaEraser />
          </button>
        </div>
      </div>
  )
}

export default WhiteBoard