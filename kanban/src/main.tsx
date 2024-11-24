import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import MainPage from './pages/MainPage.tsx';
import CreateProjectPage from './pages/CreateProjectPage.tsx';
import ProjectPage from './pages/ProjectPage.tsx';
import ErrorContextProvider from './context/ErrorContext.tsx';
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
    element: <MainPage/>
  },
  {
    path: '/createProject',
    element: <CreateProjectPage/>
  },
  {
    path: 'project',
    element: <ProjectPage/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorContextProvider>
      <RouterProvider router={router}/>
    </ErrorContextProvider>
  </StrictMode>
)
