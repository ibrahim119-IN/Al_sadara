'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { type UserRole, hasPermission, canAccessRoute, type Permission } from '../permissions'

// Dashboard User type from Payload Users collection
export interface DashboardUser {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

interface DashboardAuthContextType {
  user: DashboardUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkPermission: (permission: Permission) => boolean
  checkRouteAccess: (route: string) => boolean
  clearError: () => void
  refetch: () => Promise<void>
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

interface DashboardAuthProviderProps {
  children: ReactNode
}

export function DashboardAuthProvider({ children }: DashboardAuthProviderProps) {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user data
  const fetchMe = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setUser(null)
          return
        }
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('fetchMe error:', err)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-fetch user on mount
  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.message || 'Login failed')
      }

      // Payload sets HTTP-only cookie automatically
      // Set user data
      setUser(data.user)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      await fetch(`${API_BASE}/api/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setError(null)
      setIsLoading(false)
    }
  }, [])

  // Check permission
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false
      return hasPermission(user.role, permission)
    },
    [user]
  )

  // Check route access
  const checkRouteAccess = useCallback(
    (route: string): boolean => {
      if (!user) return false
      return canAccessRoute(user.role, route)
    },
    [user]
  )

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refetch user data
  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchMe()
  }, [fetchMe])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      checkPermission,
      checkRouteAccess,
      clearError,
      refetch,
    }),
    [user, isLoading, error, login, logout, checkPermission, checkRouteAccess, clearError, refetch]
  )

  return <DashboardAuthContext.Provider value={value}>{children}</DashboardAuthContext.Provider>
}

// Hook
export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext)
  if (!context) {
    throw new Error('useDashboardAuth must be used within a DashboardAuthProvider')
  }
  return context
}

export default DashboardAuthContext
