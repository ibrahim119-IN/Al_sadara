import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * Seed Sample Products for Testing
 * Run with: npx tsx scripts/seed-products.ts
 */

const sampleProducts = [
  {
    name: 'SABIC HDPE P6006 Pipe Grade',
    nameAr: 'بولي إيثيلين عالي الكثافة SABIC P6006 درجة الأنابيب',
    slug: 'sabic-hdpe-p6006-pipe-grade',
    sku: 'HDPE-P6006',
    description: {
      en: 'High-density polyethylene for pressure pipe applications. Excellent stress crack resistance and long-term hydrostatic strength.',
      ar: 'بولي إيثيلين عالي الكثافة لتطبيقات الأنابيب الضاغطة. مقاومة ممتازة للتشقق ومتانة هيدروستاتيكية طويلة الأجل.',
    },
    price: 25000,
    compareAtPrice: 28000,
    stock: 50,
    status: 'published',
    productType: 'hdpe',
    brand: 'SABIC',
    polymerSpecs: {
      mfi: '0.15 g/10min',
      density: '0.949 g/cm³',
      tensileStrength: '22 MPa',
      meltingPoint: '130°C',
    },
    tags: [
      { tag: 'HDPE' },
      { tag: 'أنابيب' },
      { tag: 'SABIC' },
      { tag: 'PE100' },
      { tag: 'pipe grade' },
    ],
    featured: true,
  },
  {
    name: 'Borouge LDPE FA5220 Film Grade',
    nameAr: 'بولي إيثيلين منخفض الكثافة Borouge FA5220 درجة الأفلام',
    slug: 'borouge-ldpe-fa5220-film-grade',
    sku: 'LDPE-FA5220',
    description: {
      en: 'Low-density polyethylene for high-clarity film applications. Excellent optical properties and easy processing.',
      ar: 'بولي إيثيلين منخفض الكثافة للأفلام عالية الشفافية. خصائص بصرية ممتازة وسهولة في المعالجة.',
    },
    price: 23000,
    compareAtPrice: 26000,
    stock: 35,
    status: 'published',
    productType: 'ldpe',
    brand: 'Borouge',
    polymerSpecs: {
      mfi: '2.0 g/10min',
      density: '0.922 g/cm³',
      tensileStrength: '10 MPa',
      meltingPoint: '112°C',
    },
    tags: [
      { tag: 'LDPE' },
      { tag: 'أفلام' },
      { tag: 'Borouge' },
      { tag: 'شفاف' },
      { tag: 'film grade' },
    ],
    featured: true,
  },
  {
    name: 'SABIC PP 500P Injection Grade',
    nameAr: 'بولي بروبيلين SABIC 500P درجة الحقن',
    slug: 'sabic-pp-500p-injection-grade',
    sku: 'PP-500P',
    description: {
      en: 'Polypropylene homopolymer for injection molding. High stiffness and good flow properties.',
      ar: 'بولي بروبيلين هوموبوليمر للحقن. صلابة عالية وخصائص تدفق جيدة.',
    },
    price: 22000,
    compareAtPrice: 25000,
    stock: 25,
    status: 'published',
    productType: 'pp',
    brand: 'SABIC',
    polymerSpecs: {
      mfi: '12 g/10min',
      density: '0.905 g/cm³',
      tensileStrength: '35 MPa',
      meltingPoint: '165°C',
    },
    tags: [
      { tag: 'PP' },
      { tag: 'حقن' },
      { tag: 'SABIC' },
      { tag: 'homopolymer' },
      { tag: 'injection molding' },
    ],
    featured: true,
  },
  {
    name: 'Recycled HDPE Pellets Grade A',
    nameAr: 'حبيبات HDPE معاد تدويرها درجة A',
    slug: 'recycled-hdpe-pellets-grade-a',
    sku: 'RHDPE-A',
    description: {
      en: 'High-quality recycled HDPE pellets, 95%+ purity. Suitable for non-food applications like pipes and containers.',
      ar: 'حبيبات HDPE معاد تدويرها عالية الجودة، نقاء أكثر من 95%. مناسبة للتطبيقات غير الغذائية مثل الأنابيب والحاويات.',
    },
    price: 18000,
    stock: 100,
    status: 'published',
    productType: 'recycled',
    brand: 'ESS Recycling',
    polymerSpecs: {
      mfi: '0.5-2.0 g/10min',
      density: '0.945-0.960 g/cm³',
    },
    tags: [
      { tag: 'معاد تدويره' },
      { tag: 'recycled' },
      { tag: 'HDPE' },
      { tag: 'Grade A' },
      { tag: 'صديق للبيئة' },
    ],
    featured: true,
  },
  {
    name: 'Black Masterbatch 40% Carbon',
    nameAr: 'ماستر باتش أسود 40% كربون',
    slug: 'black-masterbatch-40-carbon',
    sku: 'MB-BLK-40',
    description: {
      en: 'High-quality black masterbatch with 40% carbon black concentration. Suitable for PE and PP applications.',
      ar: 'ماستر باتش أسود عالي الجودة بتركيز 40% كربون أسود. مناسب لتطبيقات PE و PP.',
    },
    price: 35000,
    stock: 20,
    status: 'published',
    productType: 'masterbatch',
    brand: 'ESS Colors',
    masterbatchSpecs: {
      colorCode: 'RAL 9005',
      concentration: '40%',
      carrier: 'PE/PP',
    },
    tags: [
      { tag: 'ماستر باتش' },
      { tag: 'masterbatch' },
      { tag: 'أسود' },
      { tag: 'black' },
      { tag: 'carbon' },
    ],
    featured: false,
  },
  {
    name: 'PVC Resin K67 Pipe Grade',
    nameAr: 'راتنج PVC K67 درجة الأنابيب',
    slug: 'pvc-resin-k67-pipe-grade',
    sku: 'PVC-K67',
    description: {
      en: 'Suspension grade PVC resin K67 for rigid pipe applications. High purity and excellent processing.',
      ar: 'راتنج PVC معلق K67 لتطبيقات الأنابيب الصلبة. نقاء عالي ومعالجة ممتازة.',
    },
    price: 20000,
    stock: 40,
    status: 'published',
    productType: 'pvc',
    brand: 'Various',
    polymerSpecs: {
      kValue: 'K67',
      bulkDensity: '0.55 g/cm³',
    },
    tags: [
      { tag: 'PVC' },
      { tag: 'أنابيب' },
      { tag: 'K67' },
      { tag: 'راتنج' },
      { tag: 'rigid' },
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
        name: 'HDPE',
        nameAr: 'بولي إيثيلين عالي الكثافة',
        slug: 'hdpe',
        description: 'High Density Polyethylene - for pipes, containers, and films',
      },
      {
        name: 'LDPE',
        nameAr: 'بولي إيثيلين منخفض الكثافة',
        slug: 'ldpe',
        description: 'Low Density Polyethylene - for flexible packaging and films',
      },
      {
        name: 'Polypropylene',
        nameAr: 'بولي بروبيلين',
        slug: 'pp',
        description: 'Polypropylene - for injection molding and packaging',
      },
      {
        name: 'PVC',
        nameAr: 'بي في سي',
        slug: 'pvc',
        description: 'Polyvinyl Chloride - for pipes, profiles, and cables',
      },
      {
        name: 'Recycled Materials',
        nameAr: 'خامات معاد تدويرها',
        slug: 'recycled',
        description: 'Recycled plastic materials - eco-friendly options',
      },
      {
        name: 'Masterbatch',
        nameAr: 'ماستر باتش',
        slug: 'masterbatch',
        description: 'Color and additive masterbatches',
      },
    ]

    const categoryIds: Record<string, number> = {}

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

        // Map product type to category
        const categoryMap: Record<string, string> = {
          hdpe: 'hdpe',
          ldpe: 'ldpe',
          pp: 'pp',
          pvc: 'pvc',
          recycled: 'recycled',
          masterbatch: 'masterbatch',
        }

        const category = categoryIds[categoryMap[productData.productType] || 'hdpe']

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
