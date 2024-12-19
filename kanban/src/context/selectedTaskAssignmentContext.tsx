import { ReactNode, useState, createContext } from "react"



type SelectedTaskAssignmentContextType = {
    selectedTaskIdAssignment: string | null,
    togglePopup: (taskId: string ) => void; 
}

export const SelectedTaskAssignmentContext = createContext<SelectedTaskAssignmentContextType>({
    selectedTaskIdAssignment: null,
    togglePopup: () => {}
    }
)



type SelectedTaskAssignmentContextProviderProps = {
    children: ReactNode
}

export const SelectedTaskAssignmentContextProvider = ({children} :SelectedTaskAssignmentContextProviderProps) => {
    const [selectedTaskIdAssignment, setSelectedTaskIdAssignment] = useState<string | null>(null)
    console.log()
    const togglePopup = (taskId : string) => {
        console.log(taskId , "SELECTED TASK ASSINGMENT");

        setSelectedTaskIdAssignment((prev) => prev === taskId ? null : taskId)
    }

    return (
        <SelectedTaskAssignmentContext.Provider value={{selectedTaskIdAssignment, togglePopup}}>
            {children}
        </SelectedTaskAssignmentContext.Provider>
    )
}