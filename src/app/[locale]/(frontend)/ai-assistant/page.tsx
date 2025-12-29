import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { AIAssistantContent } from './AIAssistantContent'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? 'المساعد الذكي | مجموعة الصدارة القابضة'
      : 'AI Assistant | Al Sadara Holding Group',
    description: isArabic
      ? 'تحدث مع المساعد الذكي للحصول على مساعدة في اختيار المنتجات والإجابة على أسئلتك'
      : 'Chat with our AI assistant to get help choosing products and answering your questions',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/ai-assistant`,
      languages: {
        'ar': `${BASE_URL}/ar/ai-assistant`,
        'en': `${BASE_URL}/en/ai-assistant`,
      },
    },
  }
}

interface AIAssistantPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AIAssistantPage({ params }: AIAssistantPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <AIAssistantContent locale={locale} dict={dict} />
}
