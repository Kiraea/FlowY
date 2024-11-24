import React from 'react'
import {useState, useContext} from 'react'
import { Link } from "react-router-dom";
import { axiosInstance } from '../axios/axios';
import { useNavigate } from 'react-router-dom';
import { ErrorComponent } from '../context/ErrorContext';
import {ErrorContext} from '../context/ErrorContext';
import { AxiosError } from 'axios';
type user = {
    username: string,
    password: string,
};





function LoginPage() {


    const {errorC, setErrorC} = useContext(ErrorContext)

    let navigate = useNavigate()
    const [user, setUser] = useState<user>({
        username: "",
        password: "", 
    })
 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const {name, value} = e.currentTarget
        setUser((prev)=>{
            return ({...prev, [name]: value})
        })
    }

    const submitCredentials = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log(`${import.meta.env.VITE_BASE_URL_LINK}/login`)
        try{
            let result = await axiosInstance.post("/login", 
            {
                username: user.username,
                password: user.password,
            })
            console.log(result.data)
            if(result.status === 200){
                navigate('/main');
            }
            

        }catch(e: unknown){ // we do this cause we can actually thgrow anything here
            if (e instanceof Error){
                console.log(e.message);
                
            }
            if (e instanceof AxiosError){
                console.log(e.response?.data)
                setErrorC(e.response?.data.error);

            }
        }
        
    }

  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen items-center justify-center flex-col gap-y-10'>
        <ErrorComponent errorC={errorC}/>
        <h1 className='text-6xl font-Monsterrat'>Login</h1>
        <div className='flex bg-primary-bg1 w-1/2 flex-col p-10 rounded-md h-full gap-5'>
            <div className='flex gap-x-12'>
                <div className='flex flex-col w-1/2 '>
                    <label className='text-left'>Username</label>
                    <input type='text' name="username" value={user?.username} onChange={handleChange} className='input-types'/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <label>Password</label>
                    <input type='password' name="password" value={user?.password} onChange={handleChange} className='input-types'/>
                </div>
            </div>
            <div className='flex justify-between'>
                <button onClick={submitCredentials} className='bg-primary-bg2 rounded-md p-2'>Submit</button>
                <div className='text-gray-400 text-right'><Link to='/register'>Haven't Registered Yet? Click here</Link></div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage