import React from 'react'
import {useState, useContext} from 'react'
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axios/axios';
import { useNavigate } from 'react-router-dom';
import { ErrorContext } from '../context/ErrorContext';
import { AxiosError } from 'axios';
import { ErrorComponent } from '../context/ErrorContext';
type user = {
    username: string,
    password: string,
    displayname: string
};
function RegisterPage() {
    const {errorC, setErrorC} = useContext(ErrorContext)
    const navigate = useNavigate()
    const [user, setUser] = useState<user>(
        {
            username: "",
            password: "",
            displayname: ""
        }
    )

    const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.currentTarget
        setUser((prev)=>{
            return ({...prev, [name]: value})
        })
    }
    const submitRegister = async () => {

        try{
            let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/register`, {username: user.username, password: user.password, display_name: user.displayname})
            if (result.status === 200){
                navigate('/login');
            }else{
                console.log("weird");
            }
        }catch(e: unknown){
            if (e instanceof AxiosError){
                console.log(e.response?.data.error)
                setErrorC(e.response?.data.error)
            }
        }
        console.log(user.username, user.password, user.displayname);
    }

  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen items-center justify-center flex-col gap-y-10'>
        <ErrorComponent errorC={errorC}/>
        <h1 className='text-6xl font-Monsterrat'>Register</h1>
        <div className='flex bg-primary-bg1 w-1/2 flex-col p-10 rounded-md h-full gap-5'>
            <div className='flex gap-x-12'>
                <div className='flex flex-col w-1/2 '>
                    <label className='text-left'>Username</label>
                    <input type='text' name='username' value={user?.username} onChange={handleInputs} className='input-types'/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <label>Password</label>
                    <input type='password' name='password' value={user?.password} onChange={handleInputs} className='input-types'/>
                </div>
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>Display Name <span className='text-primary-bg3'>(cannot be changed)</span></label>
                <input type='text' name='displayname' value={user?.displayname} onChange={handleInputs} className='input-types'/>

            </div>
           <button onClick={submitRegister} className='bg-primary-bg2 w-1/4 rounded-md'>Submit</button>
        </div>
    </div>
  )
}

export default RegisterPage