import {PropsWithChildren, useContext, useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

type ProtectedRouteProps = PropsWithChildren
function ProtectedRoute({children}: ProtectedRouteProps) {
    const navigate = useNavigate()
    const {isLoggedIn, loading} = useContext(AuthContext);


    console.log("ProtectedRoutePROPS rendered")
    console.log("initial isLoggedin" + isLoggedIn + "initial loading" + loading)
    useEffect(()=> {
        console.log("useEffect protectRoute")
        if (!loading){
            if (!isLoggedIn){
                console.log("is not loading and is not logged in")
                console.log("isLoggedin" + isLoggedIn + "loading" + loading)
                navigate('/login', {replace:true})// so they cant go back  
            }
        }
    }, [navigate, isLoggedIn, loading]) // check why i need to make this depdencies for useEffect.

    if (loading){
        return <div>loading...</div>
    }
    
    return children
}

export default ProtectedRoute