import axios from "axios"
import { getToken } from "../auth"
export const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:3000'//local Urls

export const myAxios = axios.create({
    baseURL: BASE_URL,
})
export const privateAxios = axios.create({
    baseURL: BASE_URL,
})
privateAxios.interceptors.request.use(config=>{
    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`
        return config;
    }
},error=>Promise.reject(error));