import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import OnBoardingPage from './pages/Onboardingpage'
import useAuthUser from './hooks/useAuthUser'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.jsx'
import NotificationsPage from './pages/NotificationPage.jsx'

const App = () => {
  const { isLoading, authUser } = useAuthUser()
  const {theme} = useThemeStore();
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnBoarded

  // if (isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to={
            isOnboarded ? "/" : "/onboarding"
         }/>}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={
             isOnboarded ? "/" : "/onboarding"
          } />}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />



        <Route
          path="/notifications"
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
                  <NotificationsPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        />


        <Route
          path="/chat/:id"
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={false}>
                  <ChatPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              
                <CallPage />
             
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
