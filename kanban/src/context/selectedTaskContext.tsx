import { useState, createContext, useEffect, RefObject } from "react";
import { ReactNode } from "react";
import { useRef } from "react";
type SelectedTaskType = {
    selectedTaskId: string,
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>,
    openModal: () => void,
    closeModal: () => void,
    dialogRefUpdate: RefObject<HTMLDialogElement>|null
}


export const selectedTaskContext = createContext<SelectedTaskType>({
    selectedTaskId: "",
    setSelectedTaskId: () => {},
    openModal: () => {},
    closeModal: () => {},
    dialogRefUpdate: null,
})


type selectedTaskContextProviderProps = {
    children: ReactNode;
}
export function SelectedTaskContextProvider ({children} :selectedTaskContextProviderProps){
    const [selectedTaskId, setSelectedTaskId] = useState("")
    const dialogRefUpdate = useRef<HTMLDialogElement>(null)
    const openModal = () => {
        dialogRefUpdate.current?.showModal()
        console.log("dsadas");
    }
    const closeModal = () => {
        dialogRefUpdate.current?.close()
        console.log("dsadas");
    }


    useEffect(()=>{
        if (selectedTaskId){
            console.log("selected useEFFECT"+ selectedTaskId)
        }
    }, [selectedTaskId])

    return (
        <selectedTaskContext.Provider value={{selectedTaskId, setSelectedTaskId, openModal, closeModal, dialogRefUpdate}}>
            {children}
        </selectedTaskContext.Provider>
    )
}