import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import Navigation from '../components/Navigation'
import Dashboard from '../pages/Dashboard/Dashboard'
import TicketList from '../pages/TicketList/TicketList'
import TicketDetail from '../pages/TicketDetail/TicketDetail'
import TicketCreate from '../pages/TicketCreate/TicketCreate'
import Login from '../pages/Login/Login'
import ErrorPage from '../pages/ErrorPage/ErrorPage'

// Layout component that includes navigation
const Layout = ({ children }) => (
  <div className="app-layout">
    <Navigation />
    <main className="main-content">
      {children}
    </main>
  </div>
)

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/tickets",
    element: (
      <ProtectedRoute>
        <Layout>
          <TicketList />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/tickets/create",
    element: (
      <ProtectedRoute>
        <Layout>
          <TicketCreate />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/tickets/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <TicketDetail />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
])

export default router