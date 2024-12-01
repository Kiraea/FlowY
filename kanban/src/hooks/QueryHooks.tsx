import {useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../axios/axios'
import { Axios, AxiosError } from 'axios';

export const useUserData = () => {
    return useQuery({
        queryKey: ['displayName'],
        queryFn: (async ()=> {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getUserDisplayName`);
                if (result.status === 200){
                    console.log(result.data);
                    return result.data
                }
            }catch(e: unknown){
                if (e instanceof AxiosError){
                    console.log(e.response?.data.error);
                }else{
                    throw new Error("cannot retrieve display name");  
                }
            }
        })
    })
}

export const useGetProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: (async()=>{
            try {
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getProjectsByUserId`);
                if (result.status === 200){
                    console.log("dsakdosadkoas" + result.data.data);
                    return result.data.data
                }
            }catch(e:unknown){
                if (e instanceof AxiosError){
                    console.log(e.response?.data.error);
                }
            }
        })
    })
}


