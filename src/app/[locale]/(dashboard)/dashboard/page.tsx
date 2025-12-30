import { DashboardHome } from './DashboardHome'

// Get dashboard dictionary directly from JSON
import arDict from '@/dictionaries/ar.json'
import enDict from '@/dictionaries/en.json'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'ar'
  const dictionaries = { ar: arDict, en: enDict }
  const dict = dictionaries[validLocale]
  const dashboardDict = dict.dashboard

  return {
    title: dashboardDict.title,
  }
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params
  const validLocale = (locale === 'ar' || locale === 'en') ? locale : 'ar'

  // Get dashboard dictionary
  const dictionaries = { ar: arDict, en: enDict }
  const dict = dictionaries[validLocale]
  const dashboardDict = dict.dashboard

  return <DashboardHome locale={validLocale} dictionary={dashboardDict} />
}
