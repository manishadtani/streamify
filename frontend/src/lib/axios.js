import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL: "https://streamify-ua7t.onrender.com/api", // base url for the api
    withCredentials: true // send cookie with the request
})