import e from 'express';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FaEraser } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { IoText } from "react-icons/io5";
import { IoIosUndo } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useUserData } from '../../hooks/QueryHooks';
import { io } from 'socket.io-client';


enum OptionType {
  ERASE = "erase",
  DRAW = "draw",
  TEXT = "text"
}

function WhiteBoard() {

  const socket = io(`http://localhost:3001`)


  const {data: myUserData, isLoading: myUserIsLoading, isError: myUserIsError, error: myUserError} = useUserData()
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([])
  const [optionType, setOptionType] = useState(OptionType.DRAW)
  const modeRef = useRef<OptionType>(OptionType.DRAW);  // Store the mode
  const [color, setColor ] = useState('#111111')
  const [textLocation, setTextLocation] = useState({x: 0, y:0})

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const [userInput, setUserInput] = useState("")
  const params = useParams();
  const projectId = params.projectId || '';
  console.log(optionType, " OPTION TYPE");
  useEffect(() => {
    const handleResize = () => {
      let canvas: HTMLCanvasElement | null = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;  // Dynamically set width based on container
        canvas.height = canvas.offsetHeight; // Dynamically set height based on container
  
        // Redraw the content after resizing
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          context.lineCap = "round";
          context.lineWidth = 15;
          context.strokeStyle = color;
          context.fillStyle = "#ff0000";
          contextRef.current = context;
  
          // Reapply the drawing history
          drawingHistory?.forEach((imageData) => {
            contextRef.current?.putImageData(imageData, 0, 0);
          });
        }
      }
    };
  
    // Initial resize
    handleResize();
  
    // Add the event listener for window resize
    window.addEventListener("resize", handleResize);
  
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [drawingHistory, color, optionType]);

  useEffect(()=> {
      if(OptionType.TEXT === optionType){
        drawingHistory?.forEach((imageData) => {
            contextRef.current?.putImageData(imageData,0,0)
        })
        contextRef.current?.fillText(userInput, textLocation.x, textLocation.y)
      }
  }, [userInput, textLocation.x, textLocation.y]) 

  useEffect(()=> {
    if(contextRef.current){
      if (optionType === OptionType.DRAW || optionType === OptionType.TEXT){
          contextRef.current.globalCompositeOperation = 'source-over'
      }else if (optionType === OptionType.ERASE){
        contextRef.current.globalCompositeOperation = 'destination-out';
      }
    }
  }, [optionType])
 
  useEffect(()=> {
    if (myUserData){
      socket.emit("joinProject", ({projectId: projectId, displayName: myUserData.displayName}))
    }
    /*
    socket.on("getDrawingHistory", (drawingHistory)=> { // SHOULD THIS BE ARRAY?
      setDrawingHistory(drawingHistory)
    })
    */
    const receiveDrawingListener = (drawingData) => {
      if (contextRef.current) {
        const { data, width, height } = drawingData;
    
        // Ensure the data is a typed array (Uint8ClampedArray)
        const clampedData = new Uint8ClampedArray(data);
    
        // Ensure the data length is width * height * 4
        if (clampedData.length === width * height * 4) {
          const imageData = new ImageData(clampedData, width, height);
          setDrawingHistory((prev) => [...prev, imageData]);
        } else {
          console.error("Error in drawing data length:", {
            expectedLength: width * height * 4,
            actualLength: clampedData.length,
            width,
            height,
            data: clampedData
          });
        }
      }
    } 
    socket.on("receiveIncomingDrawings", receiveDrawingListener);

    return () => {
      if(myUserData){
        socket.off("receiveIncomingDrawings", receiveDrawingListener)
        socket.emit('leaveProject', ({projectId: projectId, displayName: myUserData.displayName}))
        // do not do this this basically means socket would disconnect from the whole server, but we just want
        // the user to leave the room not disconnect and not connect to other rooms imagine disconnect as disconnecting from all rooms not just 
        // 1 specific room
      }
    }
  }, [projectId, myUserData])



  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(OptionType.ERASE === optionType|| OptionType.DRAW === optionType){
      const {offsetX, offsetY} = e.nativeEvent as MouseEvent
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
      setIsDrawing(true)
      e.nativeEvent.preventDefault()
    }

  }

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => { 
    if(OptionType.ERASE === optionType || OptionType.DRAW === optionType){
      const {offsetX, offsetY} = e.nativeEvent
      if (!isDrawing) return
      contextRef.current?.lineTo(offsetX, offsetY)
      contextRef.current?.stroke()

      e.nativeEvent.preventDefault()
    }

  }


  const mouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if ((OptionType.DRAW === optionType || OptionType.ERASE === optionType) && canvasRef.current){
      setIsDrawing(false)
      contextRef.current?.closePath()
      e.nativeEvent.preventDefault()
      const imageData = contextRef.current?.getImageData(0,0, canvasRef.current.width , canvasRef.current.height)
      if(imageData){

        console.log(imageData)
        if (socket.connected) {
          socket.emit('draw', { projectId: projectId, drawingData: { data: imageData.data, height: imageData.height, width: imageData.width } }, (response) => {
          });
        } else {
          console.error('Socket is not connected');
        }
        setDrawingHistory((prev)=> [...prev, imageData])
      }
    }
  }
  const undo =  () => {
    setDrawingHistory((prev) => prev.slice(0, prev.length - 1));
  }

  const mouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(OptionType.ERASE === optionType || OptionType.DRAW === optionType){
      setIsDrawing(false)
      contextRef.current?.closePath()
      e.nativeEvent.preventDefault()
    }

  }

  const setToErase = () => {
    if(contextRef.current){
      contextRef.current.globalCompositeOperation = 'destination-out'
      resetTextOptions()
      setOptionType(OptionType.ERASE)
    }
  }
  const setToDraw = () => {
    if(contextRef.current){
      setIsDrawing(false)
      setOptionType(OptionType.DRAW)
      contextRef.current.globalCompositeOperation = 'source-over'
      resetTextOptions()
    }
  }
  const setToText = () => {
    if(contextRef.current){
      setIsDrawing(false)
      setOptionType(OptionType.TEXT)
    }
  }
  const resetTextOptions = () => {
     if(contextRef.current){
      setTextLocation({x:0, y:0})
      setUserInput("");
    }
  }

  const setToTextClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const {offsetX, offsetY} = e.nativeEvent
    console.log(offsetX, offsetY, "OFFSETRS")
    setTextLocation({x: offsetX, y:offsetY})
    e.nativeEvent.preventDefault()
  }

  const addText= (e: React.MouseEvent<HTMLButtonElement>) => {
    e.nativeEvent.preventDefault()
    if (OptionType.TEXT === optionType && canvasRef.current){
      const imageData = contextRef.current?.getImageData(0,0, canvasRef.current.width , canvasRef.current.height)
      if(imageData){
        socket.emit('draw', {projectId: projectId, drawingData:{data: imageData.data, height: imageData.height, width: imageData.width}})
        console.log('Emitting draw data:', projectId, "dksaodkasodkoaskdoaskdoaskdoasLOLOLOLOLO");
        setDrawingHistory((prev)=> [...prev, imageData])
      }
    }
  }

  return (
      <div className='w-full h-full bg-transparent flex flex-col p-5 ' >
        <div className='w-full flex-1'>
          <canvas ref={canvasRef}
          className='bg-primary-bg1 w-full h-full' 
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseLeave}
          onClick={setToTextClick}
          ></canvas>
        </div>
        <div className='w-full bg-primary-bg2 grid grid-rows-2 grid-cols-6 justify-between gap-8 '>
          <input type='color' className=' bg-transparent' value={color} onChange={(e)=> {setColor(e.target.value)}}></input>
          <button onClick={undo} className='flex items-center justify-center  bg-primary-bg1 rounded-lg p-3  hover:bg-primary-bg2 shadow-black shadow-sm'><IoIosUndo/></button>
          <button onClick={setToDraw} className='flex items-center justify-center p-3 sm:p-3  bg-primary-bg1 rounded-lg  hover:bg-primary-bg2 shadow-black shadow-sm'>
            <FaPencilAlt/>
          </button>
          <button onClick={setToErase} className='flex items-center justify-center p-3 sm:p-3  bg-primary-bg1 rounded-lg  hover:bg-primary-bg2 shadow-black shadow-sm'>
            <FaEraser />
          </button>
          <button onClick={setToText} className='flex items-center justify-center p-3 sm:p-3 bg-primary-bg1 rounded-lg  hover:bg-primary-bg2 shadow-black shadow-sm'>
            <IoText/>
          </button>
          <input type='text' className='text-black' value={userInput} onChange={(e)=> {setUserInput(e.currentTarget.value)}}/>
          <button onClick={addText} className='flex items-center justify-center p-3 sm:p-3  bg-primary-bg1 rounded-lg  hover:bg-primary-bg2 shadow-black shadow-sm'><FaCheck/></button>
        </div>
      </div>
  )
}

export default WhiteBoard