import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Route guard. If not authed, redirect to /login?redirect=<original>
const ProtectedRoute: React.FC = () => {
    const { auth } = useAuth()
    const loc = useLocation()
    if (!auth) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
    }
    return <Outlet />
}
export default ProtectedRoute
