import {useContext, useState, ReactNode, createContext, useEffect} from 'react'
import { axiosInstance } from '../axios/axios';
import { AxiosError } from 'axios';

type AuthContextType = {
    //displayName: string | null,
    //setDisplayName: React.Dispatch<React.SetStateAction<null>>
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

type AuthContextProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext<AuthContextType>(
    {
        //displayName: '',
        isLoggedIn: false,
        setIsLoggedIn: () => {},
        //setDisplayName: () => {}
    }
)


function AuthContextProvider({children}: AuthContextProviderProps) {
    //const [displayName, setDisplayName] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(()=> {
        verifyToken();
        setIsLoggedIn(true)
    }, [])

    const verifyToken = async() => {
        try{
            let res = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/verifySessionToken`)
            if (res.status === 200){
                setIsLoggedIn(true)
            }
        }catch(e: unknown){
            if (e instanceof AxiosError){
                console.log(e.response?.data.error)

            }
        }
    }

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider