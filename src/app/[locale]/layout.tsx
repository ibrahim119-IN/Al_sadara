import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { locales, getDirection, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0066CC' },
    { media: '(prefers-color-scheme: dark)', color: '#003366' },
  ],
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale

  const isArabic = locale === 'ar'

  const title = isArabic
    ? 'مجموعة شركات السيد شحاتة - خامات البلاستيك'
    : 'El Sayed Shehata Group - Plastic Raw Materials'

  const description = isArabic
    ? 'مجموعة شركات السيد شحاتة - رائدون في تجارة وتوريد خامات البلاستيك والبوليمرات، HDPE، LDPE، PP، إعادة التدوير، مصر والسعودية والإمارات'
    : 'El Sayed Shehata Group of Companies - Leaders in Plastic Raw Materials Trading and Polymers Supply, HDPE, LDPE, PP, Recycling - Egypt, Saudi Arabia, and UAE'

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: isArabic ? '%s | مجموعة السيد شحاتة' : '%s | El Sayed Shehata Group',
    },
    description,
    keywords: isArabic
      ? ['مجموعة السيد شحاتة', 'خامات بلاستيك', 'بوليمرات', 'HDPE', 'LDPE', 'PP', 'إعادة تدوير', 'مصر', 'السعودية', 'الإمارات']
      : ['El Sayed Shehata Group', 'Plastic Raw Materials', 'Polymers', 'HDPE', 'LDPE', 'PP', 'Recycling', 'Egypt', 'Saudi Arabia', 'UAE'],
    authors: [{ name: 'El Sayed Shehata Group' }],
    creator: 'El Sayed Shehata Group of Companies',
    publisher: 'El Sayed Shehata Group',
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'ar': `${BASE_URL}/ar`,
        'en': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isArabic ? 'ar_EG' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_EG',
      url: `${BASE_URL}/${locale}`,
      siteName: isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group',
      title,
      description,
      images: [
        {
          url: `${BASE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group of Companies',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/images/og-image.jpg`],
      creator: '@alsadara',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    category: 'business',
  }
}

// Client component to update HTML attributes
function LocaleHtmlUpdater({ locale, direction }: { locale: string; direction: 'rtl' | 'ltr' }) {
  // This will run on client to update the html element
  const script = `
    (function() {
      try {
        // Update HTML attributes
        document.documentElement.lang = '${locale}';
        document.documentElement.dir = '${direction}';
        document.documentElement.setAttribute('data-scroll-behavior', 'smooth');

        // Update body class for fonts
        document.body.className = '${direction === 'rtl' ? 'font-arabic' : 'font-sans'}';

        // Theme handling
        const theme = localStorage.getItem('al-sadara-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Locale setup error:', e);
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale

  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  const direction = getDirection(locale)

  return (
    <>
      <LocaleHtmlUpdater locale={locale} direction={direction} />
      <div
        className={direction === 'rtl' ? 'font-arabic' : 'font-sans'}
        data-locale={locale}
        data-direction={direction}
      >
        {children}
      </div>
    </>
  )
}
