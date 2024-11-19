import React from 'react'
import {useState} from 'react'
import { Link } from "react-router-dom";
type user = {
    username: string,
    password: string,
    role?: string,
    displayname: string
};

function LoginPage() {
    const [user, setUser] = useState<user | null>(null)
  return (
    <div className='text-white flex bg-primary-bg0 min-h-screen items-center justify-center flex-col gap-y-10'>
        <h1 className='text-6xl font-Monsterrat'>Login</h1>
        <div className='flex bg-primary-bg1 w-1/2 flex-col p-10 rounded-md h-full gap-5'>
            <div className='flex gap-x-12'>
                <div className='flex flex-col w-1/2 '>
                    <label className='text-left'>Username</label>
                    <input type='text' value={user?.username} onChange={()=> {user?.username}} className='input-types'/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <label>Password</label>
                    <input type='password' value={user?.password} onChange={()=>{user?.password}} className='input-types'/>
                </div>
            </div>
            <div className='flex justify-between'>
                <Link to='/main'><button type='submit' className='bg-primary-bg2 rounded-md p-2'>Submit</button></Link>
                <div className='text-gray-400 text-right'><Link to='/register'>Haven't Registered Yet? Click here</Link></div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage