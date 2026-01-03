'use client'

import { useAIAssistant, PageContext } from '@/contexts/AIAssistantContext'

/**
 * Quick Suggestions Component
 * Shows contextual suggestion buttons based on current page
 */

interface QuickSuggestionsProps {
  locale: 'ar' | 'en'
  onSuggestionClick: (suggestion: string) => void
}

// Suggestions based on page context
const suggestions: Record<PageContext['pageName'], Array<{ ar: string; en: string }>> = {
  home: [
    { ar: 'ما هي شركاتكم؟', en: 'What are your companies?' },
    { ar: 'أريد خامات بلاستيك', en: 'I need plastic materials' },
    { ar: 'فرعكم في السعودية؟', en: 'Your branch in Saudi?' },
    { ar: 'تواصل معنا', en: 'Contact us' },
  ],
  company: [
    { ar: 'ما هي خدماتكم؟', en: 'What are your services?' },
    { ar: 'أريد عرض سعر', en: 'I need a quote' },
    { ar: 'أين موقعكم؟', en: 'Where are you located?' },
    { ar: 'رقم التواصل؟', en: 'Contact number?' },
  ],
  product: [
    { ar: 'هل متوفر؟', en: 'Is it available?' },
    { ar: 'ما هو السعر؟', en: 'What is the price?' },
    { ar: 'منتجات مشابهة', en: 'Similar products' },
    { ar: 'المواصفات؟', en: 'Specifications?' },
  ],
  products: [
    { ar: 'ابحث عن منتج', en: 'Search for a product' },
    { ar: 'خامات HDPE', en: 'HDPE materials' },
    { ar: 'خامات معاد تدويرها', en: 'Recycled materials' },
    { ar: 'عرض أسعار', en: 'Price quote' },
  ],
  contact: [
    { ar: 'فروعكم في مصر؟', en: 'Your branches in Egypt?' },
    { ar: 'فرع السعودية؟', en: 'Saudi branch?' },
    { ar: 'فرع الإمارات؟', en: 'UAE branch?' },
    { ar: 'مواعيد العمل؟', en: 'Working hours?' },
  ],
  about: [
    { ar: 'متى تأسست المجموعة؟', en: 'When was the group founded?' },
    { ar: 'كم شركة لديكم؟', en: 'How many companies?' },
    { ar: 'ما هي منتجاتكم؟', en: 'What are your products?' },
    { ar: 'أين تعملون؟', en: 'Where do you operate?' },
  ],
  other: [
    { ar: 'ما هي شركاتكم؟', en: 'What are your companies?' },
    { ar: 'كيف أتواصل معكم؟', en: 'How can I contact you?' },
    { ar: 'ما هي منتجاتكم؟', en: 'What are your products?' },
    { ar: 'مساعدة', en: 'Help' },
  ],
}

export function QuickSuggestions({ locale, onSuggestionClick }: QuickSuggestionsProps) {
  const { pageContext } = useAIAssistant()

  // Get suggestions based on current page
  const currentSuggestions = suggestions[pageContext?.pageName || 'other']

  return (
    <div className="flex flex-wrap gap-2 p-3 border-t border-gray-100 bg-gray-50/50">
      {currentSuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(locale === 'ar' ? suggestion.ar : suggestion.en)}
          className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full
                     hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700
                     transition-all duration-200 whitespace-nowrap"
        >
          {locale === 'ar' ? suggestion.ar : suggestion.en}
        </button>
      ))}
    </div>
  )
}

export default QuickSuggestions
