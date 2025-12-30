'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'

// User roles for admin dashboard
export type UserRole = 'super-admin' | 'admin' | 'manager' | 'staff'

// Customer type from Payload (Customers collection)
export interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  company?: string
  customerType: 'individual' | 'business'
  addresses?: Array<{
    id?: string
    label?: string
    fullName: string
    phone: string
    address: string
    city: string
    governorate: string
    isDefault?: boolean
  }>
  createdAt: string
  updatedAt: string
}

// Admin user type from Payload (Users collection)
export interface AdminUser {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

// Union type for authenticated user
export type AuthenticatedUser =
  | (Customer & { userType: 'customer' })
  | (AdminUser & { userType: 'admin' })

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  customerType?: 'individual' | 'business'
  company?: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  addresses?: Customer['addresses']
}

// Login result with redirect info
export interface LoginResult {
  success: boolean
  userType: 'customer' | 'admin'
  redirectTo: string
  user: AuthenticatedUser
}

interface AuthContextType {
  user: AuthenticatedUser | null
  customer: Customer | null // Backwards compatibility
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  userType: 'customer' | 'admin' | null
  role: UserRole | null // For admin users
  login: (email: string, password: string) => Promise<LoginResult>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  clearError: () => void
  refetch: () => Promise<void>
  // Helper methods
  isAdmin: () => boolean
  hasRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'alsadara_auth_token'
const USER_TYPE_KEY = 'alsadara_user_type'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get token from localStorage
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }, [])

  // Get user type from localStorage
  const getUserType = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(USER_TYPE_KEY) as 'customer' | 'admin' | null
    }
    return null
  }, [])

  // Save token and user type to localStorage
  const saveAuth = useCallback((token: string, userType: 'customer' | 'admin') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_TYPE_KEY, userType)
    }
  }, [])

  // Clear auth from localStorage
  const clearAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_TYPE_KEY)
    }
  }, [])

  // Fetch current user data based on user type
  const fetchMe = useCallback(async () => {
    const token = getToken()
    const userType = getUserType()

    if (!token || !userType) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const endpoint = userType === 'customer'
        ? `${API_BASE}/api/customers/me`
        : `${API_BASE}/api/users/me`

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          clearAuth()
          setUser(null)
          return
        }
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      const userData = data.user || data

      setUser({ ...userData, userType })
    } catch (err) {
      console.error('fetchMe error:', err)
      clearAuth()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [getToken, getUserType, clearAuth])

  // Auto-fetch user on mount
  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  // Migrate guest cart to authenticated user
  const migrateGuestCart = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const guestCartStr = localStorage.getItem('alsadara_cart')
      if (!guestCartStr) return

      const guestCart = JSON.parse(guestCartStr)
      if (!Array.isArray(guestCart) || guestCart.length === 0) return

      window.dispatchEvent(new CustomEvent('cart-migrate', { detail: { items: guestCart } }))
      localStorage.removeItem('alsadara_cart')
    } catch (error) {
      console.error('Error migrating guest cart:', error)
    }
  }, [])

  // Unified Login - tries customers first, then users
  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true)
    setError(null)

    // Try customer login first
    try {
      const customerResponse = await fetch(`${API_BASE}/api/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (customerResponse.ok) {
        const data = await customerResponse.json()

        if (data.token) {
          saveAuth(data.token, 'customer')
        }

        const customerUser: AuthenticatedUser = { ...data.user, userType: 'customer' }
        setUser(customerUser)
        setError(null)
        migrateGuestCart()
        setIsLoading(false)

        return {
          success: true,
          userType: 'customer',
          redirectTo: '/account',
          user: customerUser,
        }
      }
    } catch {
      // Customer login failed, try admin login
    }

    // Try admin/user login
    try {
      const userResponse = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (userResponse.ok) {
        const data = await userResponse.json()

        if (data.token) {
          saveAuth(data.token, 'admin')
        }

        const adminUser: AuthenticatedUser = { ...data.user, userType: 'admin' }
        setUser(adminUser)
        setError(null)
        setIsLoading(false)

        return {
          success: true,
          userType: 'admin',
          redirectTo: '/dashboard',
          user: adminUser,
        }
      }

      // Both failed
      const errorData = await userResponse.json()
      throw new Error(errorData.message || errorData.errors?.[0]?.message || 'Invalid email or password')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }, [saveAuth, migrateGuestCart])

  // Register (customers only)
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          customerType: data.customerType || 'individual',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.errors?.[0]?.message || 'Registration failed')
      }

      // Auto-login after registration
      await login(data.email, data.password)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [login])

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true)
    const token = getToken()
    const userType = getUserType()

    try {
      if (token) {
        const endpoint = userType === 'customer'
          ? `${API_BASE}/api/customers/logout`
          : `${API_BASE}/api/users/logout`

        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuth()
      setUser(null)
      setError(null)
      setIsLoading(false)
    }
  }, [getToken, getUserType, clearAuth])

  // Update profile (customers only)
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    const token = getToken()
    if (!token || !user || user.userType !== 'customer') {
      throw new Error('Not authenticated as customer')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/customers/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.errors?.[0]?.message || 'Update failed')
      }

      const updatedUser = result.doc || result
      setUser({ ...updatedUser, userType: 'customer' })
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getToken, user])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refetch user data
  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchMe()
  }, [fetchMe])

  // Helper: Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.userType === 'admin'
  }, [user])

  // Helper: Check if user has specific role(s)
  const hasRole = useCallback((roles: UserRole[]) => {
    if (!user || user.userType !== 'admin') return false
    return roles.includes(user.role)
  }, [user])

  // Backwards compatibility: customer property
  const customer = useMemo(() => {
    if (user?.userType === 'customer') {
      const { userType, ...customerData } = user
      return customerData as Customer
    }
    return null
  }, [user])

  const value = useMemo(
    () => ({
      user,
      customer, // Backwards compatibility
      isAuthenticated: !!user,
      isLoading,
      error,
      userType: user?.userType || null,
      role: user?.userType === 'admin' ? user.role : null,
      login,
      register,
      logout,
      updateProfile,
      clearError,
      refetch,
      isAdmin,
      hasRole,
    }),
    [user, customer, isLoading, error, login, register, logout, updateProfile, clearError, refetch, isAdmin, hasRole]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
