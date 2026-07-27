import { useMemo } from 'react'

export function useAuth() {
  return useMemo(() => {
    const token = localStorage.getItem('token')
    const user = token ? JSON.parse(localStorage.getItem('user') || 'null') : null
    const isAuthenticated = !!token

    const hasRole = (...roles) => {
      if (!isAuthenticated) return false
      return roles.includes(user?.role)
    }

    const isCandidate = hasRole('candidate')
    const isRecruiter = hasRole('recruiter')
    const isAdmin = hasRole('admin')
    const canViewCVs = hasRole('recruiter', 'admin')

    return {
      user,
      token,
      isAuthenticated,
      hasRole,
      isCandidate,
      isRecruiter,
      isAdmin,
      canViewCVs,
      canManagePositions: hasRole('recruiter', 'admin'),
      canManageAttributes: hasRole('recruiter', 'admin'),
      canManageUsers: isAdmin
    }
  }, [])
}