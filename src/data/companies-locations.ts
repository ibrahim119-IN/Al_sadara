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
      ar: 'الشركة الأم - رائدة في تجارة وتصنيع خامات البلاستيك منذ 2005',
      en: 'Parent company - Leading in plastic raw materials trading and manufacturing since 2005',
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
        x: 68,
        y: 55,
      },
    },
    foundedYear: 2005,
    color: '#0066CC',
    icon: '🏭',
    website: 'https://industry.alsadara.org',
    specialties: {
      ar: ['خامات بلاستيك', 'HDPE', 'LDPE', 'PP'],
      en: ['Plastic Raw Materials', 'HDPE', 'LDPE', 'PP'],
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
      ar: 'متخصصون في تجارة وإعادة تدوير خامات البلاستيك',
      en: 'Specialists in plastic raw materials trading and recycling',
    },
    location: {
      city: {
        ar: '6 أكتوبر',
        en: '6th October City',
      },
      country: {
        ar: 'مصر',
        en: 'Egypt',
      },
      coordinates: {
        lat: 29.9285,
        lng: 30.9188,
      },
      mapPosition: {
        x: 50,
        y: 45,
      },
    },
    foundedYear: 2015,
    color: '#22c55e',
    icon: '🌿',
    website: 'https://talah.alsadara.org',
    specialties: {
      ar: ['خامات بلاستيك', 'إعادة تدوير', 'حبيبات بلاستيك'],
      en: ['Plastic Raw Materials', 'Recycling', 'Plastic Granules'],
    },
  },
  {
    id: '3',
    slug: 'sam',
    name: {
      ar: 'S.A.M',
      en: 'S.A.M International',
    },
    description: {
      ar: 'شركة دولية لتجارة خامات البلاستيك - المنطقة الحرة',
      en: 'International Plastic Material Trading FZE',
    },
    location: {
      city: {
        ar: 'الشارقة',
        en: 'Sharjah',
      },
      country: {
        ar: 'الإمارات',
        en: 'UAE',
      },
      coordinates: {
        lat: 25.3463,
        lng: 55.4209,
      },
      mapPosition: {
        x: 78,
        y: 50,
      },
    },
    foundedYear: 2017,
    color: '#f59e0b',
    icon: '🌍',
    website: 'https://sam.alsadara.org',
    specialties: {
      ar: ['تجارة دولية', 'خامات بلاستيك', 'استيراد وتصدير'],
      en: ['International Trade', 'Plastic Raw Materials', 'Import & Export'],
    },
  },
  {
    id: '4',
    slug: 'polymers',
    name: {
      ar: 'السيد شحاتة بوليمرز',
      en: 'El Sayed Shehata Polymers',
    },
    description: {
      ar: 'تجارة دولية للبوليمرات والخامات البلاستيكية',
      en: 'International polymers and plastic materials trading',
    },
    location: {
      city: {
        ar: 'دبي',
        en: 'Dubai',
      },
      country: {
        ar: 'الإمارات',
        en: 'UAE',
      },
      coordinates: {
        lat: 25.2048,
        lng: 55.2708,
      },
      mapPosition: {
        x: 80,
        y: 52,
      },
    },
    foundedYear: 2021,
    color: '#8b5cf6',
    icon: '🧪',
    website: 'https://polymers.alsadara.org',
    specialties: {
      ar: ['بوليمرات', 'خامات بلاستيك', 'مواد خام'],
      en: ['Polymers', 'Plastic Raw Materials', 'Raw Materials'],
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
      ar: 'تجارة خامات البلاستيك - أحدث شركات المجموعة',
      en: 'Plastic raw materials trading - Newest company in the group',
    },
    location: {
      city: {
        ar: '6 أكتوبر',
        en: '6th October City',
      },
      country: {
        ar: 'مصر',
        en: 'Egypt',
      },
      coordinates: {
        lat: 29.9285,
        lng: 30.9188,
      },
      mapPosition: {
        x: 52,
        y: 47,
      },
    },
    foundedYear: 2024,
    color: '#ef4444',
    icon: '👑',
    website: 'https://qaysar.alsadara.org',
    specialties: {
      ar: ['خامات بلاستيك', 'توزيع', 'تجارة'],
      en: ['Plastic Raw Materials', 'Distribution', 'Trading'],
    },
  },
]

export const groupInfo = {
  name: {
    ar: 'مجموعة شركات السيد شحاتة',
    en: 'El Sayed Shehata Group of Companies',
  },
  headquarters: {
    ar: 'جدة، السعودية',
    en: 'Jeddah, Saudi Arabia',
  },
  foundedYear: 2005,
  totalCompanies: 5,
  countries: ['السعودية', 'مصر', 'الإمارات'],
  countriesEn: ['Saudi Arabia', 'Egypt', 'UAE'],
}
