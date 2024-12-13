import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import MainPage from './pages/MainPage.tsx';
import CreateProjectPage from './pages/CreateProjectPage.tsx';
import ProjectPage from './pages/ProjectPage.tsx';
import ErrorContextProvider from './context/ErrorContext.tsx';
import AuthContextProvider from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { SelectedTaskContextProvider } from './context/selectedTaskContext.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage/>,
  },
  
  {
    path: '/main',
    element: <ProtectedRoute><MainPage/></ProtectedRoute>
  },
  {
    path: '/createProject',

    element: <ProtectedRoute><CreateProjectPage/> </ProtectedRoute>
  },
  {
    path: '/project/:projectId',
    element: <ProtectedRoute><ProjectPage/></ProtectedRoute>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorContextProvider>
      <AuthContextProvider >
        <SelectedTaskContextProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
          </QueryClientProvider>
        </SelectedTaskContextProvider>
      </AuthContextProvider>
    </ErrorContextProvider>
  </StrictMode>
)
