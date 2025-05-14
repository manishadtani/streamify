import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import OnBoardingPage from './pages/Onboardingpage'
import useAuthUser from './hooks/useAuthUser'
import PageLoader from './components/pageLoader.jsx'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.jsx'
import NotificationPage from './pages/NotificationPage'

const App = () => {
  const { isLoading, authUser } = useAuthUser()
  const {theme} = useThemeStore();
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnBoarded

  if (isLoading) return <PageLoader />

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
                  <NotificationPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
