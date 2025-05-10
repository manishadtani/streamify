import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Onboardingpage from './pages/Onboardingpage'
import Notificationpage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'



const App = () => {

  const {data:authData, isLoading, error} = useQuery({
    queryKey:["authUser"],

    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false,
    refetchOnMount: true,
  });

  const authUser = authData?.user


  return (
    <div className='h-screen' data-theme='night'>
      
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />}/>
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />}/>
        <Route path='/onboarding' element={authUser ? <Onboardingpage /> : <Navigate to='/login' />}/>
        <Route path='/notification' element={authUser ? <Notificationpage /> : <Navigate to='/login' />}/>
        <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to='/login' />}/>
        <Route path='/call' element={authUser ? <CallPage /> : <Navigate to='/login' />}/>
      </Routes>

      <Toaster />

    

    </div>
  )
}

export default App