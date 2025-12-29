export interface CompanyLocation {
  id: string
  slug: string
  name: {
    ar: string
    en: string
  }
  description: {
    ar: string
    en: string
  }
  location: {
    city: {
      ar: string
      en: string
    }
    country: {
      ar: string
      en: string
    }
    coordinates: {
      lat: number
      lng: number
    }
    // Position on the SVG map (percentage)
    mapPosition: {
      x: number
      y: number
    }
  }
  foundedYear: number
  color: string
  icon: string
  website: string
  specialties: {
    ar: string[]
    en: string[]
  }
}

export const companiesLocations: CompanyLocation[] = [
  {
    id: '1',
    slug: 'industry',
    name: {
      ar: 'الصدارة للصناعة',
      en: 'Al Sadara Industry',
    },
    description: {
      ar: 'الشركة الرائدة في مجال الصناعات الإلكترونية وأنظمة المباني الذكية',
      en: 'Leading company in electronic industries and smart building systems',
    },
    location: {
      city: {
        ar: 'القاهرة',
        en: 'Cairo',
      },
      country: {
        ar: 'مصر',
        en: 'Egypt',
      },
      coordinates: {
        lat: 30.0444,
        lng: 31.2357,
      },
      mapPosition: {
        x: 52,
        y: 45,
      },
    },
    foundedYear: 2010,
    color: '#0066CC',
    icon: '🏭',
    website: 'https://industry.alsadara.org',
    specialties: {
      ar: ['كاميرات مراقبة', 'أنظمة أمان', 'سنترالات'],
      en: ['CCTV Systems', 'Security Systems', 'PBX'],
    },
  },
  {
    id: '2',
    slug: 'talah',
    name: {
      ar: 'التالة الخضراء',
      en: 'Al Talah Al Khadra',
    },
    description: {
      ar: 'متخصصون في الحلول الزراعية والمنتجات الطبيعية',
      en: 'Specialists in agricultural solutions and natural products',
    },
    location: {
      city: {
        ar: 'الإسكندرية',
        en: 'Alexandria',
      },
      country: {
        ar: 'مصر',
        en: 'Egypt',
      },
      coordinates: {
        lat: 31.2001,
        lng: 29.9187,
      },
      mapPosition: {
        x: 48,
        y: 40,
      },
    },
    foundedYear: 2012,
    color: '#22c55e',
    icon: '🌿',
    website: 'https://talah.alsadara.org',
    specialties: {
      ar: ['منتجات زراعية', 'حلول بيئية', 'منتجات طبيعية'],
      en: ['Agricultural Products', 'Environmental Solutions', 'Natural Products'],
    },
  },
  {
    id: '3',
    slug: 'polymers',
    name: {
      ar: 'السيد شحاتة بوليمرز',
      en: 'El Sayed Shehata Polymers',
    },
    description: {
      ar: 'رواد صناعة البلاستيك والبوليمرات في مصر',
      en: 'Leaders in plastic and polymer manufacturing in Egypt',
    },
    location: {
      city: {
        ar: 'العاشر من رمضان',
        en: '10th of Ramadan City',
      },
      country: {
        ar: 'مصر',
        en: 'Egypt',
      },
      coordinates: {
        lat: 30.2833,
        lng: 31.7500,
      },
      mapPosition: {
        x: 54,
        y: 43,
      },
    },
    foundedYear: 2008,
    color: '#8b5cf6',
    icon: '🧪',
    website: 'https://polymers.alsadara.org',
    specialties: {
      ar: ['بلاستيك صناعي', 'بوليمرات', 'مواد خام'],
      en: ['Industrial Plastics', 'Polymers', 'Raw Materials'],
    },
  },
  {
    id: '4',
    slug: 'sam',
    name: {
      ar: 'سام إنترناشيونال',
      en: 'S.A.M International',
    },
    description: {
      ar: 'شركة دولية للتجارة والاستيراد والتصدير',
      en: 'International trading, import and export company',
    },
    location: {
      city: {
        ar: 'الرياض',
        en: 'Riyadh',
      },
      country: {
        ar: 'السعودية',
        en: 'Saudi Arabia',
      },
      coordinates: {
        lat: 24.7136,
        lng: 46.6753,
      },
      mapPosition: {
        x: 68,
        y: 55,
      },
    },
    foundedYear: 2015,
    color: '#f59e0b',
    icon: '🌍',
    website: 'https://sam.alsadara.org',
    specialties: {
      ar: ['استيراد وتصدير', 'تجارة دولية', 'توزيع'],
      en: ['Import & Export', 'International Trade', 'Distribution'],
    },
  },
  {
    id: '5',
    slug: 'qaysar',
    name: {
      ar: 'القيصر',
      en: 'Al Qaysar',
    },
    description: {
      ar: 'تجارة الجملة والتجزئة للمنتجات الاستهلاكية',
      en: 'Wholesale and retail trade for consumer products',
    },
    location: {
      city: {
        ar: 'جدة',
        en: 'Jeddah',
      },
      country: {
        ar: 'السعودية',
        en: 'Saudi Arabia',
      },
      coordinates: {
        lat: 21.4858,
        lng: 39.1925,
      },
      mapPosition: {
        x: 58,
        y: 62,
      },
    },
    foundedYear: 2014,
    color: '#ef4444',
    icon: '👑',
    website: 'https://qaysar.alsadara.org',
    specialties: {
      ar: ['تجارة جملة', 'منتجات استهلاكية', 'توزيع'],
      en: ['Wholesale Trade', 'Consumer Products', 'Distribution'],
    },
  },
  {
    id: '6',
    slug: 'coderatech',
    name: {
      ar: 'كوديراتك',
      en: 'Coderatech',
    },
    description: {
      ar: 'شركة تكنولوجيا متخصصة في تطوير البرمجيات والحلول الرقمية',
      en: 'Technology company specialized in software development and digital solutions',
    },
    location: {
      city: {
        ar: 'القاهرة الجديدة',
        en: 'New Cairo',
      },
      country: {
        ar: 'مصر',
        en: 'Egypt',
      },
      coordinates: {
        lat: 30.0291,
        lng: 31.4913,
      },
      mapPosition: {
        x: 53,
        y: 46,
      },
    },
    foundedYear: 2018,
    color: '#06b6d4',
    icon: '💻',
    website: 'https://coderatech.alsadara.org',
    specialties: {
      ar: ['تطوير برمجيات', 'تطبيقات موبايل', 'حلول ويب'],
      en: ['Software Development', 'Mobile Apps', 'Web Solutions'],
    },
  },
]

export const groupInfo = {
  name: {
    ar: 'مجموعة الصدارة القابضة',
    en: 'Al Sadara Holding Group',
  },
  headquarters: {
    ar: 'القاهرة، مصر',
    en: 'Cairo, Egypt',
  },
  foundedYear: 2008,
  totalCompanies: 6,
  countries: ['مصر', 'السعودية'],
  countriesEn: ['Egypt', 'Saudi Arabia'],
}
