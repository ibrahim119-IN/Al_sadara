import { type ReactNode } from 'react'
import { DashboardAuthProvider } from '@/lib/dashboard/auth'
import { DashboardLayout } from '@/components/dashboard/layout'
import { ProtectedRoute } from '@/components/dashboard/auth'

// Get dashboard dictionary directly from JSON
import arDict from '@/dictionaries/ar.json'
import enDict from '@/dictionaries/en.json'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardRootLayout({ children, params }: Props) {
  const { locale } = await params
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'ar'

  // Get dashboard dictionary
  const dictionaries = { ar: arDict, en: enDict }
  const dict = dictionaries[validLocale]
  const dashboardDict = dict.dashboard

  return (
    <DashboardAuthProvider>
      <ProtectedRoute locale={validLocale}>
        <DashboardLayout locale={validLocale} dictionary={dashboardDict}>
          {children}
        </DashboardLayout>
      </ProtectedRoute>
    </DashboardAuthProvider>
  )
}
