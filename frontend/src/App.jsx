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

import PageLoader from './components/pageLoader.jsx'

import useAuthUser from './hooks/useAuthUser'



const App = () => {

 const {isLoading, authUser} = useAuthUser()


 const isAuthenticated = Boolean(authUser)
 const isOnboarded = authUser?.isOnboarded

  if(isLoading) return <div><PageLoader /></div>


  return (
    <div className='h-screen' data-theme='night'>
      
      <Routes>
        <Route 
        path='/' 
        element={
          isAuthenticated && isOnboarded ? (
          <HomePage />
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
          }
          />

        <Route path='/signup' element={!isAuthenticated && !isOnboarded ? <SignupPage /> : <Navigate to='/' />}/>
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to='/' />}/>
        <Route path='/onboarding' element={isAuthenticated ? <Onboardingpage /> : <Navigate to='/login' />}/>
        <Route path='/notification' element={isAuthenticated ? <Notificationpage /> : <Navigate to='/login' />}/>
        <Route path='/chat' element={isAuthenticated ? <ChatPage /> : <Navigate to='/login' />}/>
        <Route path='/call' element={isAuthenticated ? <CallPage /> : <Navigate to='/login' />}/>
      </Routes>

      <Toaster />

    

    </div>
  )
}

export default App