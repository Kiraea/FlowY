import {useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../axios/axios'
import axios, { Axios, AxiosError } from 'axios';
import { UseQueryResult } from '@tanstack/react-query';

import { TaskType, TaskUpdateOption } from '../Types/Types';
import Project from '../components/Project';


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
// UseQueryResult<TaskType[] | null>
export const useGetTasks = (projectId: string)  => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: (async()=> {
            try{
                let result = await  axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getTasksAndMyTasksByProjectId/?projectId=${projectId}`);
                if (result.status === 200){
                    return result.data
                }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e.response?.data.error);
                }
            }
        })
    })
}

export const useGetUserId = async () => {
    try{
        let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getUserId`)
        if (result.status === 200){
            return result.data.data;
        }
    }catch(e: unknown){
        if (e instanceof AxiosError){
            console.log(e.response?.data.error)
        }
    }
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
          //console.log(result.data)
        }
    }catch(e:unknown){
      if(e instanceof AxiosError){
        console.log(e.response?.data.error)
      }
    }


}

export const useDeleteTask = async (taskId: string) => {
    try{
        let result = await axiosInstance.delete(`${import.meta.env.VITE_BASE_URL_LINK}/deleteTask/${taskId}`)
        if(result.status === 200){
            return result.data.data
        }
    }catch(e:unknown){
      if(e instanceof AxiosError){
        console.log(e.response?.data.error)
      }
    }
}

export const useUpdateTaskFull = async ({taskId, title, status, priority} : {taskId: string, title:string, status:string, priority: string }) => {
    try{
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/updateTask/${taskId}`, {title: title, status: status, priority: priority});
        if(result.status === 200){
            return result.data.data
        }
    }catch(e:unknown){
      if(e instanceof AxiosError){
        console.log(e.response?.data.error)
      }
    }
}

export const useUpdateTaskUpdate = async ({taskId, taskUpdateOption}: {taskId: string, taskUpdateOption: TaskUpdateOption}) => {
    try{
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/updateTaskUpdate/${taskId}`, {taskUpdateOption: taskUpdateOption})
        if(result.status === 200){
            return result.data.data
        }
    }catch(e:unknown){
        if(e instanceof AxiosError){
            console.log(e.response?.data.error)
        }
    }       
}


export const useGetAllTaskMembersByProjectId = (projectId: string) => {
    return useQuery({
        queryKey: ['taskMembers', projectId], // not sure if this correctw remove projectgId if error
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

export const useGetAllProjectMembersByProjectId = (projectId: string) => {
    return useQuery({
        queryKey: ['projectMembers', projectId],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getProjectMembersById/?projectId=${projectId}`);
                if (result.status === 200){
                    console.log(result.data.message)
                    return result.data.data
                }
            }catch(e: unknown){
                if (e instanceof AxiosError){
                    console.log(e.response?.data.error)
                }
            }
        }
    })
}

export const useUpdateProjectMemberRole = async ({projectId, role, memberId}: {projectId: string, role: string, memberId: string}) => {
    try{
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/updateProjectMemberRole/${projectId}`, {role, memberId})
        if (result.status === 200) {
            console.log(result.data.data)
            return result.data.data
        }
    }catch(e: unknown){
        if (e instanceof AxiosError){
            console.log(e);
        }
    }
}
