export type TimelineEventType = 'founding' | 'expansion' | 'achievement' | 'partnership' | 'milestone'

export interface TimelineEvent {
  id: string
  year: number
  month?: number
  type: TimelineEventType
  title: {
    ar: string
    en: string
  }
  description: {
    ar: string
    en: string
  }
  icon: string
  color: string
  image?: string
  companySlug?: string
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    year: 2005,
    type: 'founding',
    title: {
      ar: 'تأسيس الصدارة للصناعة',
      en: 'Al Sadara Industry Founded',
    },
    description: {
      ar: 'بداية الرحلة مع تأسيس الشركة الأم في جدة، المملكة العربية السعودية - متخصصة في تجارة خامات البلاستيك',
      en: 'The journey began with the founding of the parent company in Jeddah, Saudi Arabia - specialized in plastic raw materials trading',
    },
    icon: '🏭',
    color: '#0066CC',
    companySlug: 'sadara-industry',
  },
  {
    id: '2',
    year: 2015,
    type: 'founding',
    title: {
      ar: 'تأسيس التالة الخضراء',
      en: 'Al Talah Al Khadra Founded',
    },
    description: {
      ar: 'توسيع نطاق المجموعة مع تأسيس التالة الخضراء في 6 أكتوبر، مصر - متخصصة في تجارة وإعادة تدوير خامات البلاستيك',
      en: 'Expanding the group with the founding of Al Talah Al Khadra in 6th October City, Egypt - specialized in plastic raw materials trading and recycling',
    },
    icon: '🌿',
    color: '#22c55e',
    companySlug: 'talah',
  },
  {
    id: '3',
    year: 2017,
    type: 'expansion',
    title: {
      ar: 'تأسيس إس.إيه.إم في الإمارات',
      en: 'S.A.M Founded in UAE',
    },
    description: {
      ar: 'تأسيس شركة إس.إيه.إم (International Plastic Material Trading FZE) في الشارقة، الإمارات العربية المتحدة',
      en: 'Establishment of S.A.M (International Plastic Material Trading FZE) in Sharjah, United Arab Emirates',
    },
    icon: '🌍',
    color: '#f59e0b',
    companySlug: 'sam',
  },
  {
    id: '4',
    year: 2021,
    type: 'founding',
    title: {
      ar: 'تأسيس السيد شحاتة بوليمرز',
      en: 'El Sayed Shehata Polymers Founded',
    },
    description: {
      ar: 'تأسيس شركة السيد شحاتة بوليمرز في دبي، الإمارات - للتجارة الدولية للبوليمرات',
      en: 'Establishment of El Sayed Shehata Polymers in Dubai, UAE - for international polymers trading',
    },
    icon: '🏭',
    color: '#8b5cf6',
    companySlug: 'polymers',
  },
  {
    id: '5',
    year: 2024,
    type: 'founding',
    title: {
      ar: 'تأسيس القيصر',
      en: 'Al Qaysar Founded',
    },
    description: {
      ar: 'تأسيس شركة القيصر في 6 أكتوبر، مصر - للتوسع في سوق تجارة خامات البلاستيك المصري',
      en: 'Establishment of Al Qaysar in 6th October City, Egypt - expanding in the Egyptian plastic raw materials market',
    },
    icon: '👑',
    color: '#ef4444',
    companySlug: 'qaysar',
  },
  {
    id: '6',
    year: 2025,
    type: 'milestone',
    title: {
      ar: 'رؤية 2030',
      en: 'Vision 2030',
    },
    description: {
      ar: 'الانطلاق نحو تحقيق رؤية المجموعة للريادة الإقليمية بحلول 2030',
      en: 'Moving towards achieving the group\'s vision for regional leadership by 2030',
    },
    icon: '🎯',
    color: '#22c55e',
  },
]

export const eventTypeLabels = {
  founding: { ar: 'تأسيس', en: 'Founding' },
  expansion: { ar: 'توسع', en: 'Expansion' },
  achievement: { ar: 'إنجاز', en: 'Achievement' },
  partnership: { ar: 'شراكة', en: 'Partnership' },
  milestone: { ar: 'معلم', en: 'Milestone' },
}

export const eventTypeColors: Record<TimelineEventType, string> = {
  founding: '#0066CC',
  expansion: '#f59e0b',
  achievement: '#22c55e',
  partnership: '#8b5cf6',
  milestone: '#ef4444',
}
