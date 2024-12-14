import { useState, createContext, useEffect, RefObject } from "react";
import { ReactNode } from "react";
import { useRef } from "react";
type SelectedTaskType = {
    selectedTaskId: string,
    selectedPriority: string,
    selectedTitle: string,
    selectedStatus: string,
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>,
    setSelectedPriority: React.Dispatch<React.SetStateAction<string>>,
    setSelectedTitle: React.Dispatch<React.SetStateAction<string>>,
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>,
    openModal: () => void,
    closeModal: () => void,
    dialogRefUpdate: RefObject<HTMLDialogElement>|null
}


export const selectedTaskContext = createContext<SelectedTaskType>({
    selectedTaskId: "",
    selectedPriority: "",
    selectedStatus: "",
    selectedTitle: "",


    setSelectedTaskId: () => {},
    setSelectedPriority: () => {},
    setSelectedStatus: () => {},
    setSelectedTitle: ()=> {},
    openModal: () => {},
    closeModal: () => {},
    dialogRefUpdate: null,
})


type selectedTaskContextProviderProps = {
    children: ReactNode;
}
export function SelectedTaskContextProvider ({children} :selectedTaskContextProviderProps){
    const [selectedTaskId, setSelectedTaskId] = useState("")
    const [selectedPriority, setSelectedPriority] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedTitle, setSelectedTitle] = useState("")




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
    }, [selectedTaskId, selectedPriority, selectedStatus, selectedTitle])

    return (
        <selectedTaskContext.Provider value={{selectedPriority, selectedStatus, selectedTitle, setSelectedPriority, setSelectedStatus, setSelectedTitle,selectedTaskId, setSelectedTaskId, openModal, closeModal, dialogRefUpdate}}>
            {children}
        </selectedTaskContext.Provider>
    )
}