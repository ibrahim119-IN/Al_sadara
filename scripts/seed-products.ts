import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * Seed Sample Products for Testing
 * Run with: npx tsx scripts/seed-products.ts
 */

const sampleProducts = [
  {
    name: 'Hikvision DS-2CE16D0T-IT3F 2MP Turbo HD Camera',
    nameAr: 'كاميرا هيكفيجن DS-2CE16D0T-IT3F دقة 2 ميجا بكسل',
    slug: 'hikvision-2mp-turbo-hd-camera',
    sku: 'HIK-2CE16D0T-IT3F',
    description: {
      en: '2MP high performance EXIR bullet camera with 40m night vision range. IP67 weatherproof rating for outdoor use.',
      ar: 'كاميرا مراقبة خارجية بدقة 2 ميجا بكسل مع رؤية ليلية حتى 40 متر ومقاومة للطقس IP67',
    },
    price: 850,
    compareAtPrice: 1000,
    stock: 50,
    status: 'published',
    productType: 'cctv',
    brand: 'Hikvision',
    cctvSpecs: {
      resolution: '1080p (2MP)',
      lensType: '3.6mm Fixed',
      nightVisionRange: '40m',
      weatherResistance: 'IP67',
    },
    tags: [
      { tag: 'كاميرا خارجية' },
      { tag: 'رؤية ليلية' },
      { tag: 'هيكفيجن' },
      { tag: '2 ميجا' },
      { tag: 'turbo hd' },
    ],
    featured: true,
  },
  {
    name: 'Dahua HAC-HFW1200TLP 2MP HDCVI IR Bullet Camera',
    nameAr: 'كاميرا داهوا HAC-HFW1200TLP دقة 2 ميجا بكسل',
    slug: 'dahua-2mp-hdcvi-bullet-camera',
    sku: 'DAH-HFW1200TLP',
    description: {
      en: '2MP HDCVI IR bullet camera with 80m night vision. Smart IR technology for clear images.',
      ar: 'كاميرا مراقبة خارجية بتقنية HDCVI ورؤية ليلية حتى 80 متر مع تقنية Smart IR للصور الواضحة',
    },
    price: 920,
    compareAtPrice: 1100,
    stock: 35,
    status: 'published',
    productType: 'cctv',
    brand: 'Dahua',
    cctvSpecs: {
      resolution: '1080p (2MP)',
      lensType: '3.6mm Fixed',
      nightVisionRange: '80m',
      weatherResistance: 'IP67',
    },
    tags: [
      { tag: 'كاميرا خارجية' },
      { tag: 'رؤية ليلية' },
      { tag: 'داهوا' },
      { tag: '2 ميجا' },
      { tag: 'hdcvi' },
    ],
    featured: true,
  },
  {
    name: 'Hikvision DS-2CD2043G2-I 4MP AcuSense IP Camera',
    nameAr: 'كاميرا هيكفيجن DS-2CD2043G2-I بتقنية AcuSense دقة 4 ميجا',
    slug: 'hikvision-4mp-acusense-ip-camera',
    sku: 'HIK-2CD2043G2-I',
    description: {
      en: '4MP AcuSense fixed bullet network camera with deep learning algorithm for human and vehicle classification.',
      ar: 'كاميرا IP بتقنية AcuSense ودقة 4 ميجا مع خوارزميات التعلم العميق للتمييز بين البشر والمركبات',
    },
    price: 2100,
    compareAtPrice: 2500,
    stock: 25,
    status: 'published',
    productType: 'cctv',
    brand: 'Hikvision',
    cctvSpecs: {
      resolution: '4MP (2688×1520)',
      lensType: '2.8mm Fixed',
      nightVisionRange: '30m',
      weatherResistance: 'IP67',
    },
    tags: [
      { tag: 'كاميرا IP' },
      { tag: 'AcuSense' },
      { tag: 'هيكفيجن' },
      { tag: '4 ميجا' },
      { tag: 'تعلم عميق' },
    ],
    featured: true,
  },
  {
    name: 'Hikvision DS-7204HQHI-K1/P 4CH Turbo HD DVR',
    nameAr: 'جهاز تسجيل هيكفيجن DS-7204HQHI-K1/P على 4 قنوات',
    slug: 'hikvision-4ch-turbo-hd-dvr',
    sku: 'HIK-7204HQHI-K1P',
    description: {
      en: '4-channel 1080p Turbo HD DVR with PoC (Power over Coaxial) support. H.265+ compression.',
      ar: 'جهاز تسجيل 4 قنوات بدقة 1080p مع دعم PoC (الطاقة عبر الكابل) وضغط H.265+',
    },
    price: 1650,
    compareAtPrice: 1900,
    stock: 20,
    status: 'published',
    productType: 'cctv',
    brand: 'Hikvision',
    tags: [
      { tag: 'DVR' },
      { tag: 'هيكفيجن' },
      { tag: '4 قنوات' },
      { tag: 'PoC' },
      { tag: 'turbo hd' },
    ],
    featured: false,
  },
  {
    name: 'Dahua XVR5104HS-I3 4CH Penta-brid 1080p DVR',
    nameAr: 'جهاز تسجيل داهوا XVR5104HS-I3 على 4 قنوات',
    slug: 'dahua-4ch-penta-brid-dvr',
    sku: 'DAH-XVR5104HS-I3',
    description: {
      en: 'Penta-brid DVR supporting HDCVI/AHD/TVI/CVBS/IP cameras. AI by camera with SMD Plus.',
      ar: 'جهاز تسجيل متعدد الأنظمة يدعم HDCVI/AHD/TVI/CVBS/IP مع ذكاء اصطناعي SMD Plus',
    },
    price: 1800,
    stock: 15,
    status: 'published',
    productType: 'cctv',
    brand: 'Dahua',
    tags: [
      { tag: 'DVR' },
      { tag: 'داهوا' },
      { tag: '4 قنوات' },
      { tag: 'penta-brid' },
      { tag: 'AI' },
    ],
    featured: false,
  },
  {
    name: 'ZKTeco inBio460 Access Control Panel',
    nameAr: 'لوحة تحكم في الدخول ZKTeco inBio460',
    slug: 'zkteco-inbio460-access-control',
    sku: 'ZKT-INBIO460',
    description: {
      en: '4-door access control panel with TCP/IP communication. Supports up to 100,000 users.',
      ar: 'لوحة تحكم 4 أبواب بشبكة TCP/IP تدعم حتى 100,000 مستخدم',
    },
    price: 3500,
    stock: 10,
    status: 'published',
    productType: 'access-control',
    brand: 'ZKTeco',
    accessControlSpecs: {
      accessMethod: 'Card/Fingerprint/PIN',
      userCapacity: '100000',
    },
    tags: [
      { tag: 'access control' },
      { tag: 'ZKTeco' },
      { tag: 'بصمة' },
      { tag: 'كارت' },
    ],
    featured: false,
  },
]

async function seedProducts() {
  try {
    const payload = await getPayload({ config })

    console.log('🌱 Starting product seeding...\n')

    // First, create categories if they don't exist
    console.log('📁 Creating categories...\n')

    const categories = [
      {
        name: 'CCTV Cameras',
        nameAr: 'كاميرات المراقبة',
        slug: 'cctv-cameras',
        description: 'Security cameras and surveillance systems',
      },
      {
        name: 'Access Control',
        nameAr: 'أنظمة التحكم في الدخول',
        slug: 'access-control',
        description: 'Access control systems and devices',
      },
    ]

    const categoryIds: Record<string, string> = {}

    for (const catData of categories) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: catData.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        categoryIds[catData.slug] = existing.docs[0].id
        console.log(`⏭️  Category ${catData.slug} already exists`)
      } else {
        const cat = await payload.create({
          collection: 'categories',
          data: catData as any,
        })
        categoryIds[catData.slug] = cat.id
        console.log(`✅ Created category: ${catData.name}`)
      }
    }

    console.log('\n📦 Creating products...\n')

    for (const productData of sampleProducts) {
      try {
        // Check if product already exists
        const existing = await payload.find({
          collection: 'products',
          where: {
            sku: { equals: productData.sku },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Product ${productData.sku} already exists, skipping...`)
          continue
        }

        // Add category to product data
        const category =
          productData.productType === 'cctv'
            ? categoryIds['cctv-cameras']
            : categoryIds['access-control']

        // Create product
        const product = await payload.create({
          collection: 'products',
          data: {
            ...productData,
            category,
          } as any,
        })

        console.log(`✅ Created: ${productData.name} (${productData.sku})`)
      } catch (error: any) {
        console.error(`❌ Failed to create ${productData.sku}:`, error.message)
      }
    }

    console.log('\n🎉 Seeding complete!')
    console.log(`✅ Created ${sampleProducts.length} products`)
    console.log('\n📊 Next steps:')
    console.log('1. Run indexing: curl -X POST http://localhost:3008/api/ai/embeddings/index -H "Content-Type: application/json" -d \'{"action":"index_all"}\'')
    console.log('2. Test AI chat at: http://localhost:3008')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedProducts()
