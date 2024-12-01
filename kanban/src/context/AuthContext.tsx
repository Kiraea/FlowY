import {useContext, useState, ReactNode, createContext, useEffect} from 'react'
import { axiosInstance } from '../axios/axios';
import { AxiosError } from 'axios';

type AuthContextType = {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>

}

type AuthContextProviderProps = {
    children: ReactNode;
}

// question why do we need default vlaues here if we already have trhe state, is this before preloading time to handle it
const AuthContext = createContext<AuthContextType>(
    {
        isLoggedIn: false,
        setIsLoggedIn: () => {},
        loading: true,
        setLoading: () => {}
    }
)
// one of the problems encxountered is basically race condition since authcontextprovider is stil verifdyting, the protected route already rendered
// so we need the loaDING

function AuthContextProvider({children}: AuthContextProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    console.log("auth context provider loading" + loading)
    console.log("auth context provider isLoggedin" + isLoggedIn)
    useEffect(()=> {
        verifyToken();
    }, [])

    const verifyToken = async() => {
        try{
            let res = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/verifySessionToken`)
            if (res.status === 200){
                console.log("aithcontextfile" + setIsLoggedIn)
                setIsLoggedIn(res.data.result)
            }

            console.log("aithcontextfile2" + setIsLoggedIn)
        }catch(e: unknown){
            if (e instanceof AxiosError){
                console.log(e.response?.data.error)
                console.log("aithcontextfile3" + setIsLoggedIn)

            }
        }finally{
            console.log("setLoading finally" + loading)
            setLoading(false)
        }
    }

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, loading, setLoading}}>
        {children}
    </AuthContext.Provider>
  )
}
export default AuthContextProvider
export {AuthContext}