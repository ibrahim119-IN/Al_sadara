'use client'

import { AuthProvider } from '@/lib/auth/AuthContext'
import type { ReactNode } from 'react'

interface AuthProviderWrapperProps {
  children: ReactNode
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>
}
