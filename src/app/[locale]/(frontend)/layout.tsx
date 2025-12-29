import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingChatButton } from '@/components/ai/FloatingChatButton'
import WhatsAppWidget from '@/components/shared/WhatsAppWidget'
import { RootProvider } from '@/components/providers/RootProvider'
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/StructuredData'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  const dict = await getDictionary(locale)

  return (
    <RootProvider locale={locale} dict={dict}>
      {/* Global Structured Data */}
      <OrganizationSchema />
      <WebsiteSchema locale={locale} />

      <div className="flex flex-col min-h-screen">
        <Header locale={locale} dict={dict} />
        <main className="flex-grow">{children}</main>
        <Footer locale={locale} dict={dict} />
      </div>
      <FloatingChatButton locale={locale} />
      <WhatsAppWidget locale={locale} />
    </RootProvider>
  )
}
