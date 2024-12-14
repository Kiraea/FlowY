import { ReactNode, useState, createContext, useEffect } from "react"

type MemberRoleContextType = {
    myRole: string;
    setMyRole: React.Dispatch<React.SetStateAction<string>>;
}

export const MemberRoleContext = createContext<MemberRoleContextType>({
    myRole: "",
    setMyRole: () => {}
})


type MemberRoleProvider = {
    children: ReactNode;
    myRole: string;
    setMyRole: React.Dispatch<React.SetStateAction<string>>;
}

export const MemberRoleProvider = ({children, myRole, setMyRole} : MemberRoleProvider)=>{



    return (
        <MemberRoleContext.Provider value={{myRole, setMyRole}}>
            {children}
        </MemberRoleContext.Provider>

    )
}