import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { passwordlessAuthApi } from '../lib/api/auth'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const user = passwordlessAuthApi.getCurrentUser()

  if (!user) {
    // Preserve current path in next query param for post-login return
    const currentPath = location.pathname + location.search
    return <Navigate to={`/login?next=${encodeURIComponent(currentPath)}`} replace />
  }

  return <>{children}</>
}
