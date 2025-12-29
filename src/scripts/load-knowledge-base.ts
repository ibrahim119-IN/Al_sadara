import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { GeminiClient } from '@/lib/ai/core/gemini-client'

/**
 * Knowledge Base Loader
 * Loads markdown files from knowledge-base directory into database
 * and generates embeddings for RAG system
 */

interface KnowledgeBaseFile {
  slug: string
  title: string
  content: string
  type: 'policy' | 'faq'
  category: string
  locale: 'ar' | 'en'
}

const geminiClient = new GeminiClient()

async function loadKnowledgeBase() {
  console.log('[KB Loader] Starting Knowledge Base loading...')

  const payload = await getPayload({ config })

  // Define knowledge base directories
  const knowledgeBasePath = path.join(process.cwd(), 'src', 'knowledge-base')
  const policiesPath = path.join(knowledgeBasePath, 'policies')
  const faqsPath = path.join(knowledgeBasePath, 'faqs')

  // Load policies
  console.log('[KB Loader] Loading policies...')
  const policyFiles = fs.readdirSync(policiesPath)

  for (const filename of policyFiles) {
    if (!filename.endsWith('.md')) continue

    const filePath = path.join(policiesPath, filename)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract metadata from filename
    const slug = filename.replace('.md', '')
    const category = slug.replace('-policy', '')

    // Split content into Arabic and English sections
    const sections = splitByLanguage(content)

    // Save Arabic version
    if (sections.ar) {
      await saveKnowledgeBaseItem({
        slug: `${slug}-ar`,
        title: extractTitle(sections.ar, 'ar'),
        content: sections.ar,
        type: 'policy',
        category,
        locale: 'ar',
      })
    }

    // Save English version
    if (sections.en) {
      await saveKnowledgeBaseItem({
        slug: `${slug}-en`,
        title: extractTitle(sections.en, 'en'),
        content: sections.en,
        type: 'policy',
        category,
        locale: 'en',
      })
    }

    console.log(`[KB Loader] ✅ Loaded policy: ${slug}`)
  }

  // Load FAQs
  console.log('[KB Loader] Loading FAQs...')
  const faqFiles = fs.readdirSync(faqsPath)

  for (const filename of faqFiles) {
    if (!filename.endsWith('.md')) continue

    const filePath = path.join(faqsPath, filename)
    const content = fs.readFileSync(filePath, 'utf-8')

    const slug = filename.replace('.md', '')
    const category = slug

    // Split content into Arabic and English sections
    const sections = splitByLanguage(content)

    // Save Arabic version
    if (sections.ar) {
      await saveKnowledgeBaseItem({
        slug: `faq-${slug}-ar`,
        title: extractTitle(sections.ar, 'ar'),
        content: sections.ar,
        type: 'faq',
        category,
        locale: 'ar',
      })
    }

    // Save English version
    if (sections.en) {
      await saveKnowledgeBaseItem({
        slug: `faq-${slug}-en`,
        title: extractTitle(sections.en, 'en'),
        content: sections.en,
        type: 'faq',
        category,
        locale: 'en',
      })
    }

    console.log(`[KB Loader] ✅ Loaded FAQ: ${slug}`)
  }

  console.log('[KB Loader] ✅ All knowledge base items loaded successfully!')
}

/**
 * Split markdown content by language (Arabic and English)
 */
function splitByLanguage(content: string): { ar?: string; en?: string } {
  const sections: { ar?: string; en?: string } = {}

  // Find "## العربية" section
  const arMatch = content.match(/## العربية\s+([\s\S]*?)(?=\n---\n|## English|$)/i)
  if (arMatch) {
    sections.ar = arMatch[1].trim()
  }

  // Find "## English" section
  const enMatch = content.match(/## English\s+([\s\S]*?)$/i)
  if (enMatch) {
    sections.en = enMatch[1].trim()
  }

  return sections
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, locale: 'ar' | 'en'): string {
  // Try to extract from first # heading
  const titleMatch = content.match(/^#\s+(.+?)(?:\s+\||$)/m)
  if (titleMatch) {
    const fullTitle = titleMatch[1].trim()
    // If bilingual title (contains |), extract by locale
    if (fullTitle.includes('|')) {
      const [arTitle, enTitle] = fullTitle.split('|').map((t) => t.trim())
      return locale === 'ar' ? arTitle : enTitle
    }
    return fullTitle
  }

  // Fallback: use first line
  const firstLine = content.split('\n')[0].replace(/^#+\s*/, '').trim()
  return firstLine || 'Untitled'
}

/**
 * Save knowledge base item to database with embeddings
 */
async function saveKnowledgeBaseItem(item: KnowledgeBaseFile) {
  const payload = await getPayload({ config })

  try {
    // Check if item already exists
    const existing = await payload.find({
      collection: 'knowledge-base',
      where: {
        slug: {
          equals: item.slug,
        },
      },
      limit: 1,
    })

    // Generate embedding for content
    // ✅ FIX: Truncate content if too long (max 10000 chars for embedding)
    const contentForEmbedding =
      item.content.length > 10000 ? item.content.substring(0, 10000) : item.content

    console.log(
      `[KB Loader] Generating embedding for: ${item.slug} (${contentForEmbedding.length} chars)`
    )
    const embeddingResult = await geminiClient.generateEmbedding(contentForEmbedding)
    // ✅ FIX: Extract values array from Gemini response
    const embedding = embeddingResult.values || embeddingResult
    console.log(`[KB Loader] Embedding dimension: ${embedding.length}`)

    const data = {
      title: item.title,
      slug: item.slug,
      content: item.content,
      type: item.type,
      category: item.category,
      locale: item.locale,
      embedding: embedding, // Array of numbers
      metadata: {
        wordCount: item.content.split(/\s+/).length,
        embeddingDimension: embedding.length,
        lastUpdated: new Date().toISOString(),
      },
    }

    if (existing.docs.length > 0) {
      // Update existing
      await payload.update({
        collection: 'knowledge-base',
        id: existing.docs[0].id,
        data,
      })
      console.log(`[KB Loader] Updated: ${item.slug}`)
    } else {
      // Create new
      await payload.create({
        collection: 'knowledge-base',
        data,
      })
      console.log(`[KB Loader] Created: ${item.slug}`)
    }
  } catch (error: any) {
    console.error(`[KB Loader] Error saving ${item.slug}:`, error.message)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  loadKnowledgeBase()
    .then(() => {
      console.log('[KB Loader] ✅ Knowledge Base loading completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('[KB Loader] ❌ Error:', error)
      process.exit(1)
    })
}

export { loadKnowledgeBase }
