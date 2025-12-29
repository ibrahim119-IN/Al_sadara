'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'

// Customer type from Payload
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

interface AuthContextType {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  clearError: () => void
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'alsadara_auth_token'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get token from localStorage
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }, [])

  // Save token to localStorage
  const saveToken = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }, [])

  // Clear token from localStorage
  const clearToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [])

  // Fetch current customer data
  const fetchMe = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setCustomer(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/customers/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          clearToken()
          setCustomer(null)
          return
        }
        throw new Error('Failed to fetch customer data')
      }

      const data = await response.json()
      setCustomer(data.user || data)
    } catch (err) {
      console.error('fetchMe error:', err)
      clearToken()
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }, [getToken, clearToken])

  // Auto-fetch customer on mount
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

      // Trigger a custom event to notify CartContext about the migration
      window.dispatchEvent(new CustomEvent('cart-migrate', { detail: { items: guestCart } }))

      // Clear guest cart from localStorage after migration
      localStorage.removeItem('alsadara_cart')
    } catch (error) {
      console.error('Error migrating guest cart:', error)
    }
  }, [])

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/customers/login`, {
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

      // Save token
      if (data.token) {
        saveToken(data.token)
      }

      // Set customer data
      setCustomer(data.user)
      setError(null)

      // Migrate guest cart to authenticated user
      migrateGuestCart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [saveToken, migrateGuestCart])

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

    try {
      // Call logout endpoint if we have a token
      if (token) {
        await fetch(`${API_BASE}/api/customers/logout`, {
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
      // Clear local state regardless of API result
      clearToken()
      setCustomer(null)
      setError(null)
      setIsLoading(false)
    }
  }, [getToken, clearToken])

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    const token = getToken()
    if (!token || !customer) {
      throw new Error('Not authenticated')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/customers/${customer.id}`, {
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

      // Update local customer data
      setCustomer(result.doc || result)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getToken, customer])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refetch customer data
  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchMe()
  }, [fetchMe])

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: !!customer,
      isLoading,
      error,
      login,
      register,
      logout,
      updateProfile,
      clearError,
      refetch,
    }),
    [customer, isLoading, error, login, register, logout, updateProfile, clearError, refetch]
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
