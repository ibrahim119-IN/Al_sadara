import { getPayload } from 'payload'
import config from '@/payload.config'

async function checkKB() {
  const payload = await getPayload({ config })

  const kbDocs = await payload.find({
    collection: 'knowledge-base',
    limit: 10,
  })

  console.log(`[CHECK] Total KB entries: ${kbDocs.totalDocs}`)
  console.log(`[CHECK] Returned ${kbDocs.docs.length} docs`)

  kbDocs.docs.forEach((doc, index) => {
    console.log(`\n[${index + 1}] ${doc.slug}`)
    console.log(`  Title: ${doc.title}`)
    console.log(`  Type: ${doc.type}`)
    console.log(`  Locale: ${doc.locale}`)
    console.log(`  Has Embedding: ${doc.embedding ? 'Yes' : 'No'}`)
    if (doc.embedding) {
      const embLen = Array.isArray(doc.embedding) ? doc.embedding.length : 'Not an array'
      console.log(`  Embedding Length: ${embLen}`)
    }
    console.log(`  Content Length: ${doc.content?.length || 0} chars`)
  })
}

checkKB().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})
