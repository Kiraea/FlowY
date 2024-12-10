import { useState, createContext, useEffect } from "react";
import { ReactNode } from "react";

type SelectedTaskType = {
    selectedTaskId: string,
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>
}


export const selectedTaskContext = createContext<SelectedTaskType>({
    selectedTaskId: "",
    setSelectedTaskId: () => {}
})


type selectedTaskContextProviderProps = {
    children: ReactNode;
}
function selectedTaskContextProvider ({children} :selectedTaskContextProviderProps){
    const [selectedTaskId, setSelectedTaskId] = useState("")


    useEffect(()=>{
        if (selectedTaskId){
            console.log("selected useEFFECT"+ selectedTaskId)
        }
    }, [selectedTaskId])

    return (
        <selectedTaskContext.Provider value={{selectedTaskId: selectedTaskId, setSelectedTaskId: setSelectedTaskId}}>
            {children}
        </selectedTaskContext.Provider>
    )
}