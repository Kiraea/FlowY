import { createContext } from "react"
import { ReactNode } from "react"
type ProjectMembersProviderProps= {
    children: ReactNode,
    projectMembers: any,
    errorProjectMembers: Error | null,
    isLoadingProjectMembers:boolean,
    isErrorProjectMembers:boolean
}
type ProjectMembersContextProps= {
    projectMembers: any,
    errorProjectMembers: Error | null,
    isLoadingProjectMembers:boolean,
    isErrorProjectMembers:boolean
}

const ProjectMembersContextDefault = {
    projectMembers: [], 
    isLoadingProjectMembers: false,
    errorProjectMembers: null, 
    isErrorProjectMembers: false,
}

export const ProjectMembersContext = createContext<ProjectMembersContextProps>(ProjectMembersContextDefault)

export function ProjectMembersProvider ({children, projectMembers, isLoadingProjectMembers, errorProjectMembers, isErrorProjectMembers}: ProjectMembersProviderProps) {


    return (
        <ProjectMembersContext.Provider value={{projectMembers, isLoadingProjectMembers, errorProjectMembers, isErrorProjectMembers}}>
            {children}
        </ProjectMembersContext.Provider>
    )
}