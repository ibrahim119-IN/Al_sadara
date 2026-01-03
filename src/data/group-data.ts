/**
 * Unified Group Data - Single Source of Truth
 * مجموعة السيد شحاتة للتجارة والصناعة - ITs
 */

export interface Company {
  id: string
  slug: string
  name: {
    ar: string
    en: string
  }
  logo: string
  color: string
  description: {
    ar: string
    en: string
  }
  fullDescription?: {
    ar: string
    en: string
  }
  location: {
    country: 'egypt' | 'saudi' | 'uae'
    city: {
      ar: string
      en: string
    }
    address?: {
      ar: string
      en: string
    }
    coordinates: {
      lat: number
      lng: number
    }
  }
  founded: number
  type: 'plastics' | 'electronics' | 'recycling' | 'trading'
  contact: {
    phones: string[]
    email: string
    whatsapp?: string
    website?: string
  }
  services: Array<{
    ar: string
    en: string
  }>
  products?: Array<{
    ar: string
    en: string
  }>
  vision?: {
    ar: string
    en: string
  }
  mission?: {
    ar: string
    en: string
  }
  whyChooseUs?: Array<{
    ar: string
    en: string
  }>
}

// Group Information - الهوية الصحيحة للمجموعة
export const groupInfo = {
  name: {
    ar: 'مجموعة السيد شحاتة للتجارة والصناعة',
    en: 'El Sayed Shehata Group for Trade & Industry',
  },
  shortName: {
    ar: 'ITs',
    en: 'ITs',
  },
  logo: '/images/group-logo.png',
  founded: 2005,
  totalCompanies: 5,
  countries: {
    ar: ['مصر', 'السعودية', 'الإمارات'],
    en: ['Egypt', 'Saudi Arabia', 'UAE'],
  },
  headquarters: {
    ar: 'جدة، المملكة العربية السعودية',
    en: 'Jeddah, Saudi Arabia',
  },
  website: 'elsayedshehatagroup.com',
  description: {
    ar: 'مجموعة متكاملة من الشركات المتخصصة في تجارة خامات البلاستيك والإلكترونيات وأنظمة المباني الذكية، تعمل في مصر والسعودية والإمارات',
    en: 'An integrated group of companies specialized in plastic raw materials trading, electronics, and smart building systems, operating in Egypt, Saudi Arabia, and UAE',
  },
  contact: {
    phones: ['+966554401575', '+201099853546'],
    email: 'info@alsadara.org',
    whatsapp: '+966554401575',
  },
}

// Companies Data - بيانات الشركات الموحدة
export const companies: Company[] = [
  {
    id: '1',
    slug: 'sadara-industry',
    name: {
      ar: 'الصدارة للصناعة',
      en: 'Al Sadara Industry',
    },
    logo: '/images/sadara-logo.png',
    color: '#0066CC',
    description: {
      ar: 'الشركة الأم - رائدة في تجارة وتصنيع خامات البلاستيك منذ 2005',
      en: 'The parent company - Leading in plastic raw materials trading and manufacturing since 2005',
    },
    fullDescription: {
      ar: 'تأسست شركة الصدارة للصناعة عام 2005 في جدة بالمملكة العربية السعودية كنواة لمجموعة السيد شحاتة. بدأت الشركة في تجارة خامات البلاستيك ثم توسعت في 2021 لتشمل التصنيع. تخدم الشركة المصانع والشركات في المملكة العربية السعودية ودول الخليج.',
      en: 'Al Sadara Industry was established in 2005 in Jeddah, Saudi Arabia as the nucleus of El Sayed Shehata Group. The company started in plastic raw materials trading and expanded in 2021 to include manufacturing. The company serves factories and companies in Saudi Arabia and the Gulf countries.',
    },
    location: {
      country: 'saudi',
      city: {
        ar: 'جدة',
        en: 'Jeddah',
      },
      address: {
        ar: 'جدة، المملكة العربية السعودية',
        en: 'Jeddah, Saudi Arabia',
      },
      coordinates: {
        lat: 21.4858,
        lng: 39.1925,
      },
    },
    founded: 2005,
    type: 'plastics',
    contact: {
      phones: ['+966554401575', '+966553335462'],
      email: 'sadaraplast@gmail.com',
      whatsapp: '+966554401575',
      website: 'elsayedshehatagroup.com',
    },
    services: [
      { ar: 'تجارة خامات البلاستيك', en: 'Plastic Raw Materials Trading' },
      { ar: 'تصنيع منتجات بلاستيكية', en: 'Plastic Products Manufacturing' },
      { ar: 'توريد للمصانع', en: 'Factory Supply' },
    ],
    products: [
      { ar: 'بولي إيثيلين (PE)', en: 'Polyethylene (PE)' },
      { ar: 'بولي بروبلين (PP)', en: 'Polypropylene (PP)' },
      { ar: 'بولي ستيرين (PS)', en: 'Polystyrene (PS)' },
      { ar: 'PET', en: 'PET' },
      { ar: 'PVC', en: 'PVC' },
      { ar: 'EVA', en: 'EVA' },
    ],
    vision: {
      ar: 'أن نكون الشريك الأول والموثوق للمصانع في المملكة العربية السعودية ودول الخليج',
      en: 'To be the first and trusted partner for factories in Saudi Arabia and Gulf countries',
    },
    mission: {
      ar: 'تقديم خامات بلاستيكية عالية الجودة بأسعار تنافسية مع الالتزام بالمواعيد',
      en: 'Providing high-quality plastic raw materials at competitive prices with commitment to deadlines',
    },
    whyChooseUs: [
      { ar: 'خبرة تزيد عن 19 عاماً', en: 'Over 19 years of experience' },
      { ar: 'تنوع في المنتجات', en: 'Product diversity' },
      { ar: 'أسعار تنافسية', en: 'Competitive prices' },
      { ar: 'سرعة في التوريد', en: 'Fast delivery' },
    ],
  },
  {
    id: '2',
    slug: 'talah',
    name: {
      ar: 'التالة الخضراء',
      en: 'Al Talah Al Khadra',
    },
    logo: '/images/talah-logo.png',
    color: '#22c55e',
    description: {
      ar: 'متخصصون في تجارة وإعادة تدوير خامات البلاستيك في مصر',
      en: 'Specialists in plastic raw materials trading and recycling in Egypt',
    },
    fullDescription: {
      ar: 'تأسست شركة التالة الخضراء عام 2015 في مدينة 6 أكتوبر بمصر، وتعمل في مجال تجارة خامات البلاستيك وإعادة التدوير. تخدم الشركة المصانع والشركات داخل مصر وخارجها مع الالتزام بالمعايير البيئية.',
      en: 'Al Talah Al Khadra was established in 2015 in 6th of October City, Egypt, working in plastic raw materials trading and recycling. The company serves factories and companies inside and outside Egypt while adhering to environmental standards.',
    },
    location: {
      country: 'egypt',
      city: {
        ar: '6 أكتوبر',
        en: '6th of October City',
      },
      address: {
        ar: 'مدينة 6 أكتوبر، الجيزة، مصر',
        en: '6th of October City, Giza, Egypt',
      },
      coordinates: {
        lat: 29.9668,
        lng: 30.9284,
      },
    },
    founded: 2015,
    type: 'recycling',
    contact: {
      phones: ['+201099853546', '+201050464424'],
      email: 'talahgregypt@gmail.com',
      whatsapp: '+201099853546',
      website: 'elsayedshehatagroup.com',
    },
    services: [
      { ar: 'تجارة خامات البلاستيك', en: 'Plastic Raw Materials Trading' },
      { ar: 'إعادة تدوير البلاستيك', en: 'Plastic Recycling' },
      { ar: 'توريد للمصانع', en: 'Factory Supply' },
    ],
    products: [
      { ar: 'بولي إيثيلين (PE)', en: 'Polyethylene (PE)' },
      { ar: 'بولي بروبلين (PP)', en: 'Polypropylene (PP)' },
      { ar: 'خامات معاد تدويرها', en: 'Recycled Materials' },
    ],
    vision: {
      ar: 'المساهمة في الحفاظ على البيئة من خلال إعادة التدوير المستدام',
      en: 'Contributing to environmental preservation through sustainable recycling',
    },
    mission: {
      ar: 'توفير خامات بلاستيكية عالية الجودة مع الحفاظ على البيئة',
      en: 'Providing high-quality plastic materials while preserving the environment',
    },
    whyChooseUs: [
      { ar: 'حلول صديقة للبيئة', en: 'Eco-friendly solutions' },
      { ar: 'جودة عالية', en: 'High quality' },
      { ar: 'أسعار منافسة', en: 'Competitive prices' },
    ],
  },
  {
    id: '3',
    slug: 'polymers',
    name: {
      ar: 'السيد شحاتة بوليمرز',
      en: 'El Sayed Shehata Polymers',
    },
    logo: '/images/polymers-logo.png',
    color: '#8b5cf6',
    description: {
      ar: 'شركة تجارة دولية للبوليمرات وخامات البلاستيك مقرها دبي',
      en: 'International polymers and plastic raw materials trading company based in Dubai',
    },
    fullDescription: {
      ar: 'تأسست شركة السيد شحاتة بوليمرز عام 2021 في دبي بالإمارات العربية المتحدة، وتعمل في مجال التجارة الدولية لخامات البلاستيك والبوليمرات. تخدم الشركة الأسواق في منطقة الخليج وأفريقيا والشرق الأوسط.',
      en: 'El Sayed Shehata Polymers was established in 2021 in Dubai, UAE, working in international trading of plastic raw materials and polymers. The company serves markets in the Gulf region, Africa, and the Middle East.',
    },
    location: {
      country: 'uae',
      city: {
        ar: 'دبي',
        en: 'Dubai',
      },
      address: {
        ar: 'دبي، الإمارات العربية المتحدة',
        en: 'Dubai, United Arab Emirates',
      },
      coordinates: {
        lat: 25.2048,
        lng: 55.2708,
      },
    },
    founded: 2021,
    type: 'trading',
    contact: {
      phones: ['+971503830860', '+971522097468'],
      email: 'alsayedshehata2050@gmail.com',
      whatsapp: '+971503830860',
      website: 'elsayedshehatagroup.com',
    },
    services: [
      { ar: 'تجارة دولية', en: 'International Trading' },
      { ar: 'توريد بوليمرات', en: 'Polymers Supply' },
      { ar: 'استيراد وتصدير', en: 'Import & Export' },
    ],
    products: [
      { ar: 'بولي إيثيلين (PE)', en: 'Polyethylene (PE)' },
      { ar: 'بولي بروبلين (PP)', en: 'Polypropylene (PP)' },
      { ar: 'بوليمرات متنوعة', en: 'Various Polymers' },
    ],
    vision: {
      ar: 'أن نكون الجسر التجاري الرائد للبوليمرات بين آسيا وأفريقيا',
      en: 'To be the leading trading bridge for polymers between Asia and Africa',
    },
    mission: {
      ar: 'ربط الأسواق العالمية بخامات بلاستيكية عالية الجودة',
      en: 'Connecting global markets with high-quality plastic raw materials',
    },
    whyChooseUs: [
      { ar: 'شبكة دولية واسعة', en: 'Wide international network' },
      { ar: 'موقع استراتيجي في دبي', en: 'Strategic location in Dubai' },
      { ar: 'خبرة في الأسواق العالمية', en: 'Experience in global markets' },
    ],
  },
  {
    id: '4',
    slug: 'sam',
    name: {
      ar: 'إس.إيه.إم',
      en: 'S.A.M',
    },
    logo: '/images/sam-logo.png',
    color: '#f59e0b',
    description: {
      ar: 'شركة متخصصة في تجارة خامات البلاستيك - International Plastic Material Trading FZE',
      en: 'International Plastic Material Trading FZE - Specialized in plastic raw materials',
    },
    fullDescription: {
      ar: 'تأسست شركة إس.إيه.إم (International Plastic Material Trading FZE) عام 2017 في الشارقة بالإمارات العربية المتحدة. نحن شركة متخصصة في تجارة وتوريد خامات ومواد البلاستيك عالية الجودة، ونعمل على خدمة المصانع والشركات في منطقة الخليج والشرق الأوسط.',
      en: 'S.A.M (International Plastic Material Trading FZE) was established in 2017 in Sharjah, UAE. We are a company specialized in trading and supplying high-quality plastic raw materials, serving factories and companies in the Gulf region and Middle East.',
    },
    location: {
      country: 'uae',
      city: {
        ar: 'الشارقة',
        en: 'Sharjah',
      },
      address: {
        ar: 'الشارقة، الإمارات العربية المتحدة',
        en: 'Sharjah, United Arab Emirates',
      },
      coordinates: {
        lat: 25.3463,
        lng: 55.4209,
      },
    },
    founded: 2017,
    type: 'trading',
    contact: {
      phones: ['+966554401575', '+966553335462'],
      email: 'sadaraplast@gmail.com',
      whatsapp: '+966554401575',
      website: 'elsayedshehatagroup.com',
    },
    services: [
      { ar: 'تجارة خامات البلاستيك', en: 'Plastic Raw Materials Trading' },
      { ar: 'توريد للمصانع', en: 'Factory Supply' },
      { ar: 'خدمة ما بعد البيع', en: 'After-sales Service' },
    ],
    products: [
      { ar: 'بولي إيثيلين (PE)', en: 'Polyethylene (PE)' },
      { ar: 'بولي بروبلين (PP)', en: 'Polypropylene (PP)' },
      { ar: 'بولي ستيرين (PS)', en: 'Polystyrene (PS)' },
      { ar: 'PET', en: 'PET' },
      { ar: 'PVC', en: 'PVC' },
      { ar: 'EVA', en: 'EVA' },
    ],
    vision: {
      ar: 'أن نكون بحلول عام 2030 الشريك الموثوق للمصانع وشركات التصنيع البلاستيكي والرائدة في تجارة المواد الخام البلاستيكية في دول الخليج وأفريقيا والشرق الأوسط',
      en: 'To be by 2030 the trusted partner for factories and plastic manufacturing companies and the leader in plastic raw materials trading in the Gulf, Africa, and Middle East',
    },
    mission: {
      ar: 'تقديم حلول توريد متكاملة لخامات البلاستيك وتوفير احتياجات مختلف الصناعات البلاستيكية مع ضمان المتابعة بعد البيع',
      en: 'Providing integrated supply solutions for plastic raw materials and meeting the needs of various plastic industries with guaranteed after-sales follow-up',
    },
    whyChooseUs: [
      { ar: 'تنوع جميع أنواع الخامات', en: 'Variety of all types of materials' },
      { ar: 'أسعار تنافسية', en: 'Competitive prices' },
      { ar: 'سرعة في التوريد', en: 'Fast delivery' },
      { ar: 'خدمة ما بعد البيع', en: 'After-sales service' },
    ],
  },
  {
    id: '5',
    slug: 'qaysar',
    name: {
      ar: 'القيصر',
      en: 'Al Qaysar',
    },
    logo: '/images/qaysar-logo.png',
    color: '#ef4444',
    description: {
      ar: 'شركة متخصصة في تجارة خامات البلاستيك في مصر',
      en: 'Company specialized in plastic raw materials trading in Egypt',
    },
    fullDescription: {
      ar: 'في عام 2024 توسعت المجموعة وقامت بافتتاح شركة القيصر في مصر. نحن شركة متخصصة في تجارة وتوريد خامات ومواد البلاستيك عالية الجودة، ونعمل على خدمة المصانع والشركات داخل مصر وخارجها مع الالتزام بتوفير خامات مطابقة للمواصفات العالمية.',
      en: 'In 2024, the group expanded and opened Al Qaysar in Egypt. We are a company specialized in trading and supplying high-quality plastic raw materials, serving factories and companies inside and outside Egypt while providing materials that meet international specifications.',
    },
    location: {
      country: 'egypt',
      city: {
        ar: '6 أكتوبر',
        en: '6th of October City',
      },
      address: {
        ar: 'مدينة 6 أكتوبر، مصر',
        en: '6th of October City, Egypt',
      },
      coordinates: {
        lat: 29.9668,
        lng: 30.9284,
      },
    },
    founded: 2024,
    type: 'plastics',
    contact: {
      phones: ['01099853546', '01062054941'],
      email: 'alsayedshehata2050@gmail.com',
      whatsapp: '01099853546',
      website: 'elsayedshehatagroup.com',
    },
    services: [
      { ar: 'تجارة خامات البلاستيك', en: 'Plastic Raw Materials Trading' },
      { ar: 'توريد للمصانع', en: 'Factory Supply' },
      { ar: 'خدمة ما بعد البيع', en: 'After-sales Service' },
    ],
    products: [
      { ar: 'بولي إيثيلين (PE)', en: 'Polyethylene (PE)' },
      { ar: 'بولي بروبلين (PP)', en: 'Polypropylene (PP)' },
      { ar: 'بولي ستيرين (PS)', en: 'Polystyrene (PS)' },
      { ar: 'PET', en: 'PET' },
      { ar: 'PVC', en: 'PVC' },
      { ar: 'EVA', en: 'EVA' },
    ],
    vision: {
      ar: 'أن نكون بحلول عام 2030 الشريك الموثوق للمصانع وشركات التصنيع البلاستيكي والرائدة في تجارة المواد الخام البلاستيكية في أفريقيا والشرق الأوسط',
      en: 'To be by 2030 the trusted partner for factories and plastic manufacturing companies and the leader in plastic raw materials trading in Africa and the Middle East',
    },
    mission: {
      ar: 'تقديم حلول توريد متكاملة لخامات البلاستيك وتوفير احتياجات مختلف الصناعات البلاستيكية مع ضمان المتابعة بعد البيع',
      en: 'Providing integrated supply solutions for plastic raw materials and meeting the needs of various plastic industries with guaranteed after-sales follow-up',
    },
    whyChooseUs: [
      { ar: 'تنوع جميع أنواع الخامات', en: 'Variety of all types of materials' },
      { ar: 'أسعار تنافسية', en: 'Competitive prices' },
      { ar: 'سرعة في التوريد', en: 'Fast delivery' },
      { ar: 'خدمة ما بعد البيع', en: 'After-sales service' },
    ],
  },
]

// Helper function to get company by slug
export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((company) => company.slug === slug)
}

// Helper function to get companies by country
export function getCompaniesByCountry(country: 'egypt' | 'saudi' | 'uae'): Company[] {
  return companies.filter((company) => company.location.country === country)
}

// Helper function to get companies by type
export function getCompaniesByType(type: 'plastics' | 'electronics' | 'recycling' | 'trading'): Company[] {
  return companies.filter((company) => company.type === type)
}

// Country flags for display
export const countryFlags: Record<string, string> = {
  egypt: '🇪🇬',
  saudi: '🇸🇦',
  uae: '🇦🇪',
}

// Country names
export const countryNames: Record<string, { ar: string; en: string }> = {
  egypt: { ar: 'مصر', en: 'Egypt' },
  saudi: { ar: 'السعودية', en: 'Saudi Arabia' },
  uae: { ar: 'الإمارات', en: 'UAE' },
}

// Geographic coordinates for the map
export const mapLocations = {
  jeddah: { lat: 21.4858, lng: 39.1925 },
  october: { lat: 29.9668, lng: 30.9284 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  cairo: { lat: 30.0444, lng: 31.2357 },
}
