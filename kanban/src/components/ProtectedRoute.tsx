import {PropsWithChildren, useContext, useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

type ProtectedRouteProps = PropsWithChildren
function ProtectedRoute({children}: ProtectedRouteProps) {
    const navigate = useNavigate()
    const {isLoggedIn, loading} = useContext(AuthContext);
    console.log(new Date() + "protectedRoute")
    console.log(loading + "loading");
    console.log(isLoggedIn + "isloggedin");
    useEffect(()=> {
        console.log(loading)
        if (!loading)
        {
            console.log(loading)
            if(!isLoggedIn){
                navigate('/login', {replace:true})// so they cant go back  

            }
        }
    }, [navigate, isLoggedIn, loading]) // check why i need to make this depdencies for useEffect.

    if (loading){
        return <div>loading...</div>
    }
    if (!isLoggedIn){
        return null
    }
    
    return children
}

export default ProtectedRoute