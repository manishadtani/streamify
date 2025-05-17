import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL: "https://streamify-ua7t.onrender.com/api",
    withCredentials:true,  // send cookiew with the request
    

})