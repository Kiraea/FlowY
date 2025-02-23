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
import { Socket } from 'socket.io-client';


enum OptionType {
  ERASE = "erase",
  DRAW = "draw",
  TEXT = "text"
}
type Drawing =  | Stroke | Text


type Stroke = {
  type: 'stroke',
  x: number,
  userId: string
  y: number;
  lineWidth: number;
  strokeStyle: string; // Assuming color is a string
  fillStyle: string;
  globalCompositeOperation: GlobalCompositeOperation;
}

type Text = {
   type: 'text';
   x: number;
   y: number; text: string;
   font: string;
   fillStyle: string;
   userId: string;
}
  
function WhiteBoard() {



  const {data: myUserData, isLoading: myUserIsLoading, isError: myUserIsError, error: myUserError} = useUserData()
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingHistory, setDrawingHistory] = useState<Drawing[][]>([])
  const drawingHistoryRef = useRef(drawingHistory);
  useEffect(() => {
    drawingHistoryRef.current = drawingHistory;
  }, [drawingHistory]);
  const socketRef = useRef<Socket | null>(null)
  const strokeListRef =useRef<Stroke[]>([]);

  const [optionType, setOptionType] = useState(OptionType.DRAW)
  const modeRef = useRef<OptionType>(OptionType.DRAW);  // Store the mode
  const [color, setColor ] = useState('#111111')
  const [lineWidth, setLineWidth] = useState(10)
  const [textLocation, setTextLocation] = useState({x: 0, y:0})

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const [userInput, setUserInput] = useState("")
  const params = useParams();
  const projectId = params.projectId || '';
  useEffect(() => {
    console.log("USEEFFECT1");
    const handleResize = () => {
      let canvas: HTMLCanvasElement | null = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;  
        canvas.height = canvas.offsetHeight; // 
     
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          context.lineCap = "round";
          context.lineWidth = lineWidth;
          context.strokeStyle = color;
          context.fillStyle = color;
          contextRef.current = context;
  
    
          drawingHistory?.forEach((batch, batchIndex) => {
            if (Array.isArray(batch) && contextRef.current) {
              batch.forEach((fullStroke) => {


                if(fullStroke.type === "stroke"){
                  contextRef.current?.beginPath();
                  contextRef.current!.lineWidth = fullStroke.lineWidth || 0;
                  contextRef.current!.strokeStyle = fullStroke.strokeStyle;
                  contextRef.current!.lineTo(fullStroke.x, fullStroke.y);
                  contextRef.current!.stroke();
                  contextRef.current!.globalCompositeOperation =
                    fullStroke.globalCompositeOperation || "source-over";
                  contextRef.current!.closePath();
                }

                if (fullStroke.type === 'text'){
                    contextRef.current!.font = fullStroke.font
                    contextRef.current!.fillText(fullStroke.text,fullStroke.x, fullStroke.y)
                }

              });
            } else {
              console.error(`Batch at index ${batchIndex} is not an array:`, batch);
            }
          }); //

        }
        strokeListRef.current = [];
      }
    };
    handleResize()
  }, [drawingHistory, color, optionType]);


console.log(drawingHistory);
  useEffect(()=> {
    let i = 0;
    socketRef.current = io(`http://localhost:3001`)
    socketRef.current.connect()
    console.log("useEffect2")
    if (myUserData){
      socketRef.current.emit("joinProject", ({projectId: projectId, displayName: myUserData.displayName}))
    }

    const receiveDrawingListener = (drawingStroke) => {
      console.log("RECEIVING DRAWING");
      if (contextRef.current) {
      setDrawingHistory((prev) => {
        if(prev.length > 0){
          return [...prev, drawingStroke]
        }else{
          return [drawingStroke]
        }
        })
      }
    }
    const receiveUndoListener = (userId) => {
      if (contextRef.current){
        console.log(":RECIEVE UNDO RECEIVER: ", userId)
        let lastUserDrawing = -1;
        setDrawingHistory((prevDrawingHistory) => {
          const updatedHistory = [...prevDrawingHistory]; 
          for (let x = updatedHistory.length -1 ; x >= 0; x--) {
            console.log(updatedHistory[x][0].userId, "COMPARE", userId);
            if (updatedHistory[x][0].userId === userId) {
              lastUserDrawing = x;
              break;
            }
          }
  
        console.log(lastUserDrawing, "LAST USER DRAWING");
  
        if (lastUserDrawing !== -1) {
          // Remove the user's last drawing (batch) from the array
          updatedHistory.splice(lastUserDrawing, 1);
        }
  
        // Return the updated history (this will set the state to the updated value)
        return updatedHistory;
      });
      }
    }


    socketRef.current!.on('informExistingUserOfNewPerson', ({ toUserId }) => {
      console.log("you are the chosen one ")
      console.log(drawingHistoryRef.current);
      socketRef.current!.emit('syncDrawingHistory', { toUserId: toUserId, drawingHistory: drawingHistoryRef.current, projectId: projectId });
    });

    socketRef.current!.on('getInitialDrawings', ({drawingHistory})=> {
      console.log("getting initialData", drawingHistory)
      setDrawingHistory(drawingHistory);
    })

    socketRef.current!.on('receiveUndoDrawings', receiveUndoListener)
    socketRef.current!.on("receiveIncomingDrawings", receiveDrawingListener);

    return () => {
      if(myUserData){
        console.log("RETURN USEFFECT2")
        socketRef.current?.off("receiveIncomingDrawings", receiveDrawingListener)
        socketRef.current!.emit('leaveProject', ({projectId: projectId, displayName: myUserData.displayName}))

        socketRef.current!.disconnect()
        // do not do this this basically means socket would disconnect from the whole server, but we just want
        // the user to leave the room not disconnect and not connect to other rooms imagine disconnect as disconnecting from all rooms not just 
        // 1 specific room
      }
    }
  }, [projectId, myUserData])
   useEffect(()=> {
    if(contextRef.current){
      if (optionType === OptionType.DRAW || optionType === OptionType.TEXT){
          contextRef.current.globalCompositeOperation = 'source-over'
      }else if (optionType === OptionType.ERASE){
        contextRef.current.globalCompositeOperation = 'destination-out';
      }
    }
  }, [optionType])


  const drawingInterval = useRef<ReturnType<typeof setInterval>>(); // Store drawingInterval in useRef
  
  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (OptionType.ERASE === optionType || OptionType.DRAW === optionType && contextRef.current) {
      const { offsetX, offsetY } = e.nativeEvent as MouseEvent;
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
      setIsDrawing(true);
  
      const newStroke = {
        type: "stroke",
        x: offsetX,
        y: offsetY,
        lineWidth: lineWidth,
        strokeStyle: color, // the outline color
        fillStyle: color, // the fill color (if applicable)
        globalCompositeOperation: contextRef.current?.globalCompositeOperation,
        userId: myUserData.displayName
      } as Stroke;
  
      strokeListRef.current.push(newStroke);
     
      e.nativeEvent.preventDefault();
    }
  };
  
  
  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => { 
    if(OptionType.ERASE === optionType || OptionType.DRAW === optionType){
      const {offsetX, offsetY} = e.nativeEvent
      if (!isDrawing) return
        contextRef.current?.lineTo(offsetX, offsetY)
        contextRef.current?.stroke()
      const newStroke = {
        type: "stroke",
        x: offsetX,
        y: offsetY,
        lineWidth: lineWidth,
        strokeStyle: color ,
        fillStyle: color, 
        globalCompositeOperation: contextRef.current?.globalCompositeOperation,
        userId: myUserData.displayName
      } as Stroke;

     strokeListRef.current.push(newStroke) 

      e.nativeEvent.preventDefault()
    }

  }
  const fillGaps = (strokeList: Stroke[]) => {
    const newStrokeList = [];
    for (let i = 0; i < strokeList.length - 1; i++) {
      const currentStroke = strokeList[i];
      const nextStroke = strokeList[i + 1];
  
      newStrokeList.push(currentStroke);
  

      const diffX = Math.abs(nextStroke.x - currentStroke.x);
      const diffY = Math.abs(nextStroke.y - currentStroke.y);
  
      if (diffX > 1 || diffY > 1) {
        const steps = Math.max(diffX, diffY); 
        for (let j = 1; j <= steps; j++) {
          const interpX = currentStroke.x + (nextStroke.x - currentStroke.x) * (j / steps);
          const interpY = currentStroke.y + (nextStroke.y - currentStroke.y) * (j / steps);
  
        
          const newStroke = {
            type: "stroke",
            x: interpX,
            y: interpY,
            lineWidth: currentStroke.lineWidth,
            strokeStyle: currentStroke.strokeStyle,
            fillStyle: currentStroke.fillStyle,
            globalCompositeOperation: currentStroke.globalCompositeOperation as GlobalCompositeOperation, // Cast it explicitly
            userId: currentStroke.userId
          };
  
      
          newStrokeList.push(newStroke);
        }
      }
    }
  
   
    newStrokeList.push(strokeList[strokeList.length - 1]);
  
    return newStrokeList as Stroke[];
  };


  const mouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if ((OptionType.DRAW === optionType || OptionType.ERASE === optionType) && canvasRef.current && socketRef.current){
      setIsDrawing(false)
      contextRef.current?.closePath()
      e.nativeEvent.preventDefault()
      const filledStrokeList = fillGaps(strokeListRef.current);
      setDrawingHistory((prev)=> [...prev, filledStrokeList])
        if (socketRef.current.connected) {
          socketRef.current.emit('draw', { projectId: projectId, drawingStroke: filledStrokeList }, (response) => {
          });
        } else {
          console.error('Socket is not connected');
        }
      }
    }



    /*
  useEffect(()=> {
      if(OptionType.TEXT === optionType){
        drawingHistory?.forEach((imageData) => {
            contextRef.current?.putImageData(imageData,0,0)
        })
        contextRef.current?.fillText(userInput, textLocation.x, textLocation.y)
      }
  }, [userInput, textLocation.x, textLocation.y]) 
  */
  /*

  */
  const undo =  () => {
    if (contextRef.current){


      let lastUserDrawing = -1
      for (let x = drawingHistory.length - 1; x >= 0 ; x--){
          console.log(drawingHistory[x][0].userId, myUserData.displayName, "UNDO UNDO UNDO")
        if (drawingHistory[x][0].userId === myUserData.displayName){
          lastUserDrawing = x
          break 
        }
      }
      
      if (lastUserDrawing !== -1){
        socketRef.current!.emit('undo', {userId: myUserData.displayName, projectId: projectId})
        setDrawingHistory((prev)=> {
          const updatedHistory = [...prev]
          updatedHistory.splice(lastUserDrawing,1)
          return updatedHistory 

        })
      }
    }
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
      resetTextOptions()
      setIsDrawing(false)
      setOptionType(OptionType.ERASE)

    }
  }
  const setToDraw = () => {
    if(contextRef.current){
      setIsDrawing(false)
      setOptionType(OptionType.DRAW)
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
    if (optionType === OptionType.TEXT){
      const {offsetX, offsetY} = e.nativeEvent
      console.log(offsetX, offsetY, "OFFSETRS")
      setTextLocation({x: offsetX, y:offsetY})
      e.nativeEvent.preventDefault()
    }
  }


  
  const addText= (e: React.MouseEvent<HTMLButtonElement>) => {

    e.nativeEvent.preventDefault()
    if (OptionType.TEXT === optionType && canvasRef.current){
        const newTextDrawing: Drawing = {
          type: 'text', // Type is 'text'
          x: textLocation.x,
          y: textLocation.y,
          text: userInput, // The user input text
          font: '16px Arial', // Specify the font style here
          fillStyle: 'black', // Specify the text color
          userId: myUserData.displayName // The userId of the person creating the text
        } as Text; 


      setDrawingHistory((prev)=> {

        return [...prev, [newTextDrawing] as Text[]]
      })

        socketRef.current!.emit('draw', {projectId: projectId, drawingStroke: [newTextDrawing]})
        console.log('Emitting draw data:', projectId, "dksaodkasodkoaskdoaskdoaskdoasLOLOLOLOLO");
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