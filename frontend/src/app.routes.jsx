import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/LoginPage.jsx'
import Register from './pages/RegisterPage.jsx'
import RootLayout from './components/layout/RootLayout.jsx'
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element:<ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: '/login',
        element: <Login />
      }
      ,
      {
        path: '/register',
        element: <Register />
      }
    ]
  }
])