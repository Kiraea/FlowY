import axios from 'axios';


const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_LINK,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
  });




  export {instance as axiosInstance}