'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'

interface WhatsAppWidgetProps {
  locale: Locale
  phoneNumber?: string
  message?: string
}

export default function WhatsAppWidget({
  locale,
  phoneNumber = '+966554401575', // رقم المجموعة الافتراضي
  message,
}: WhatsAppWidgetProps) {
  const isRTL = locale === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show widget after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const defaultMessage = isRTL
    ? 'مرحباً، أود الاستفسار عن خدماتكم ومنتجاتكم.'
    : 'Hello, I would like to inquire about your services and products.'

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message || defaultMessage)}`

  const texts = {
    ar: {
      title: 'تواصل معنا عبر واتساب',
      subtitle: 'مرحباً! كيف يمكننا مساعدتك؟',
      cta: 'ابدأ المحادثة',
      online: 'متصل الآن',
      responseTime: 'نرد عادةً خلال دقائق',
    },
    en: {
      title: 'Chat with us on WhatsApp',
      subtitle: 'Hello! How can we help you?',
      cta: 'Start Chat',
      online: 'Online now',
      responseTime: 'We usually reply within minutes',
    },
  }

  const t = texts[locale]

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-6 z-50 ${isRTL ? 'left-6' : 'right-6'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Chat Popup */}
      <div
        className={`absolute bottom-20 ${isRTL ? 'left-0' : 'right-0'} w-80 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#25D366] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-sm text-white/90 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {t.online}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 bg-[#ECE5DD]">
          {/* Message Bubble */}
          <div className={`bg-white rounded-lg p-3 shadow-sm max-w-[85%] ${isRTL ? 'mr-auto' : 'ml-0'}`}>
            <p className="text-gray-800 text-sm">{t.subtitle}</p>
            <span className="text-xs text-gray-500 mt-1 block">
              {new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">{t.responseTime}</p>
        </div>

        {/* CTA Button */}
        <div className="p-4 bg-white border-t">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-center py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            {t.cta}
          </a>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#25D366] hover:bg-[#20BD5A]'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open WhatsApp chat'}
      >
        {/* Pulse Animation */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-20" />
          </>
        )}

        {/* Icon */}
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-7 h-7 text-white transition-transform duration-300" />
          ) : (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </span>

        {/* Tooltip */}
        {!isOpen && (
          <span
            className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
              isRTL ? 'right-full mr-3' : 'left-full ml-3'
            }`}
          >
            {t.title}
          </span>
        )}
      </button>
    </div>
  )
}
