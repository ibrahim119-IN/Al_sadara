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
    year: 2008,
    type: 'founding',
    title: {
      ar: 'تأسيس السيد شحاتة بوليمرز',
      en: 'El Sayed Shehata Polymers Founded',
    },
    description: {
      ar: 'بداية الرحلة مع تأسيس أول شركة في المجموعة، متخصصة في صناعة البلاستيك والبوليمرات',
      en: 'The journey began with the founding of the first company in the group, specialized in plastic and polymer manufacturing',
    },
    icon: '🏭',
    color: '#8b5cf6',
    companySlug: 'polymers',
  },
  {
    id: '2',
    year: 2010,
    type: 'founding',
    title: {
      ar: 'تأسيس الصدارة للصناعة',
      en: 'Al Sadara Industry Founded',
    },
    description: {
      ar: 'تأسيس الشركة الأم للمجموعة، الصدارة للإلكترونيات وأنظمة المباني الذكية',
      en: 'Establishment of the group\'s parent company, Al Sadara for Electronics and Smart Building Systems',
    },
    icon: '⚡',
    color: '#0066CC',
    companySlug: 'industry',
  },
  {
    id: '3',
    year: 2011,
    type: 'achievement',
    title: {
      ar: 'أول 100 عميل',
      en: 'First 100 Clients',
    },
    description: {
      ar: 'تحقيق إنجاز الوصول لأول 100 عميل مؤسسي في مجال أنظمة الأمان والمراقبة',
      en: 'Achieved the milestone of reaching the first 100 institutional clients in security and surveillance systems',
    },
    icon: '🎯',
    color: '#22c55e',
  },
  {
    id: '4',
    year: 2012,
    type: 'founding',
    title: {
      ar: 'تأسيس التالة الخضراء',
      en: 'Al Talah Al Khadra Founded',
    },
    description: {
      ar: 'توسيع نطاق المجموعة بدخول قطاع الحلول الزراعية والمنتجات الطبيعية',
      en: 'Expanding the group\'s scope by entering the agricultural solutions and natural products sector',
    },
    icon: '🌿',
    color: '#22c55e',
    companySlug: 'talah',
  },
  {
    id: '5',
    year: 2014,
    type: 'founding',
    title: {
      ar: 'تأسيس القيصر',
      en: 'Al Qaysar Founded',
    },
    description: {
      ar: 'دخول سوق التجزئة والجملة مع تأسيس شركة القيصر للمنتجات الاستهلاكية',
      en: 'Entering the retail and wholesale market with the founding of Al Qaysar for consumer products',
    },
    icon: '👑',
    color: '#ef4444',
    companySlug: 'qaysar',
  },
  {
    id: '6',
    year: 2015,
    type: 'expansion',
    title: {
      ar: 'التوسع إلى السعودية',
      en: 'Expansion to Saudi Arabia',
    },
    description: {
      ar: 'تأسيس سام إنترناشيونال في الرياض، أول تواجد للمجموعة خارج مصر',
      en: 'Establishment of S.A.M International in Riyadh, the group\'s first presence outside Egypt',
    },
    icon: '🌍',
    color: '#f59e0b',
    companySlug: 'sam',
  },
  {
    id: '7',
    year: 2016,
    type: 'achievement',
    title: {
      ar: 'شهادة الأيزو 9001',
      en: 'ISO 9001 Certification',
    },
    description: {
      ar: 'حصول المجموعة على شهادة الجودة العالمية ISO 9001 لأنظمة إدارة الجودة',
      en: 'The group obtained the international ISO 9001 quality certification for quality management systems',
    },
    icon: '🏆',
    color: '#0066CC',
  },
  {
    id: '8',
    year: 2018,
    type: 'founding',
    title: {
      ar: 'تأسيس كوديراتك',
      en: 'Coderatech Founded',
    },
    description: {
      ar: 'دخول عالم التكنولوجيا الرقمية مع تأسيس شركة كوديراتك لتطوير البرمجيات',
      en: 'Entering the digital technology world with the founding of Coderatech for software development',
    },
    icon: '💻',
    color: '#06b6d4',
    companySlug: 'coderatech',
  },
  {
    id: '9',
    year: 2020,
    type: 'milestone',
    title: {
      ar: 'تجاوز 500 موظف',
      en: 'Surpassing 500 Employees',
    },
    description: {
      ar: 'نمو فريق العمل ليتجاوز 500 موظف عبر جميع شركات المجموعة',
      en: 'Team growth to surpass 500 employees across all group companies',
    },
    icon: '👥',
    color: '#8b5cf6',
  },
  {
    id: '10',
    year: 2022,
    type: 'achievement',
    title: {
      ar: 'إطلاق المنصة الرقمية',
      en: 'Digital Platform Launch',
    },
    description: {
      ar: 'إطلاق المنصة الرقمية الموحدة للمجموعة مع نظام ذكاء اصطناعي متكامل',
      en: 'Launch of the group\'s unified digital platform with an integrated AI system',
    },
    icon: '🚀',
    color: '#0066CC',
  },
  {
    id: '11',
    year: 2024,
    type: 'expansion',
    title: {
      ar: 'التوسع في جدة',
      en: 'Expansion to Jeddah',
    },
    description: {
      ar: 'افتتاح فرع جديد للقيصر في جدة لتعزيز التواجد في السوق السعودي',
      en: 'Opening a new Al Qaysar branch in Jeddah to strengthen presence in the Saudi market',
    },
    icon: '📍',
    color: '#ef4444',
  },
  {
    id: '12',
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
