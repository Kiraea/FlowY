import {useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../axios/axios'
import axios, { Axios, AxiosError } from 'axios';
import { UseQueryResult } from '@tanstack/react-query';

type TaskType =  {
  id: string; // UUID format
  task_title: string; // Corresponds to "task_title"
  task_priority: string; // Corresponds to "task_priority_type", replace `string` with an enum if needed
  task_status: string; // Corresponds to "task_status_type", replace `string` with an enum if needed
  created_at?: Date; // "created_at" is optional because of the DEFAULT value
  project_id: string; // UUID of the associated project
}


export const useUserData = () => {
    return useQuery({
        queryKey: ['displayName'],
        queryFn: (async ()=> {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getUserDisplayName`);
                if (result.status === 200){
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

export const useGetTasks = (projectId: string): UseQueryResult<TaskType[] | null> => {
    return useQuery<TaskType[] | null>({
        queryKey: ['tasks', projectId],
        queryFn: (async()=> {
            try{
                let result = await  axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getTasksByProjectId/?projectId=${projectId}`);
                if (result.status === 200){
                    return result.data.data 
                }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e.response?.data.error);
                }
            }
        })
    })
}

export const useUpdateTaskStatus=  async ({taskId, newStatus} : {taskId: string, newStatus: string}) => {
    try{
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/updateTaskStatus`, {taskId: taskId, taskStatus: newStatus})
        if (result.status === 200){
            return result.data.data;
        }
    }catch(e: unknown){
        if (e instanceof AxiosError){
            console.log(e.response?.data.error)
        }
    }

}

export const useAddTaskFull = async (formData: FormData) => {
    try{
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/addTaskFull`, formData);
        if(result.status === 200){
          console.log(result.data)
        }
    }catch(e:unknown){
      if(e instanceof AxiosError){
        console.log(e.response?.data.error)
      }
    }


}


export const useGetAllTaskMembersByProjectId = (projectId: string) => {
    return useQuery({
        queryKey: ['taskMembers'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getTaskMembersByProjectId/?projectId=${projectId}`);
                if (result.status === 200){
                    console.log(result.data.data)
                    return result.data.data
                }
            }catch(e: unknown){
                if (e instanceof AxiosError){
                    console.log(e);
                }
            }
        }
    })
}
