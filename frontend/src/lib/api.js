import { axiosInstance } from "./axios";



export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
    } catch (error) {
        console.log(error)
        return null
    }
}

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
} 

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
} 


export const completeOnBoarding = async (userData) => {
    const res = await axiosInstance.post('/auth/onboarding', userData);
    return res.data; 
}

export const getUserFriends = async () => {
    const res = await axiosInstance.get('/user/friends');
    return res.data;
}

export const getRecomendedUsers = async () => {
    const res = await axiosInstance.get('/user');
    return res.data;
}
 

export const getOutGoingFriendRequests = async () => {
    const res = await axiosInstance.get('/user/outgoing-friend-requests');
    return res.data;
}


export const sendFriendRequest = async (userId) => {
    console.log(userId)
    const res = await axiosInstance.post(`/user/friend-request/${userId}`);
    console.log(res.data)
    return res.data;
}

export const getFriendRequests = async () => {
    const res = await axiosInstance.get('/user/friend-requests');
    return res.data;
}

export const acceptFriendRequest = async (requestId) => {
    const res = await axiosInstance.put(`/user/friend-request/${requestId}/accept`)
        return res.data;
}

export const getStreamToken = async () => {
    const res = await axiosInstance.put('/chat/token')
        return res.data;
}