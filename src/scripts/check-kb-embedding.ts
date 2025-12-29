import { getPayload } from 'payload'
import config from '@/payload.config'

async function checkEmbedding() {
  const payload = await getPayload({ config })

  const doc = await payload.find({
    collection: 'knowledge-base',
    where: {
      slug: { equals: 'return-policy-ar' }
    },
    limit: 1,
  })

  if (doc.docs.length > 0) {
    const entry = doc.docs[0]
    console.log('Entry:', entry.slug)
    console.log('Embedding type:', typeof entry.embedding)
    console.log('Is Array:', Array.isArray(entry.embedding))

    if (entry.embedding) {
      console.log('Embedding keys:', Object.keys(entry.embedding).slice(0, 10))
      console.log('Sample values:', Object.values(entry.embedding).slice(0, 5))
    }
  } else {
    console.log('No return-policy-ar found')
  }
}

checkEmbedding().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})
