import {PropsWithChildren, useContext, useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

type ProtectedRouteProps = PropsWithChildren
function ProtectedRoute({children}: ProtectedRouteProps) {
    const navigate = useNavigate()
    
    const {isLoggedIn} = useContext(AuthContext);
    console.log(isLoggedIn);
    useEffect(()=> {
        if (!isLoggedIn){
            navigate('/login`', {replace:true})// so they cant go back  
        }
    }, [navigate, isLoggedIn]) // check why i need to make this depdencies for useEffect.

    
    return children
}

export default ProtectedRoute