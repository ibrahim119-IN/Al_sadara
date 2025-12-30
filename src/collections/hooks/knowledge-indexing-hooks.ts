/**
 * Knowledge Base Indexing Hooks
 * Automatically generates embeddings when knowledge base entries change
 *
 * Uses beforeChange to generate embedding BEFORE saving,
 * so the embedding is stored in the same document
 */

import type { CollectionBeforeChangeHook } from 'payload'
import { generateEmbedding } from '@/lib/gemini/embeddings'

/**
 * Before Knowledge Base Change Hook
 * Generates embedding for the content before saving
 */
export const beforeKnowledgeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  // Skip if not active
  if (data.isActive === false) {
    console.log(`[KnowledgeHook] Skipping inactive entry: ${data.slug}`)
    return data
  }

  // Check if content actually changed (or if it's a new document)
  const contentChanged =
    operation === 'create' ||
    data.content !== originalDoc?.content ||
    data.title !== originalDoc?.title

  // Skip if content hasn't changed
  if (!contentChanged) {
    console.log(`[KnowledgeHook] Content unchanged for: ${data.slug}`)
    return data
  }

  // Validate we have content to embed
  if (!data.content || !data.title) {
    console.log(`[KnowledgeHook] Missing content or title for: ${data.slug}`)
    return data
  }

  try {
    console.log(`[KnowledgeHook] Generating embedding for: ${data.slug} (${operation})`)
    const startTime = Date.now()

    // Build searchable text
    // Include title, type, category, and content for comprehensive embedding
    const searchableText = [
      `العنوان: ${data.title}`,
      data.type ? `النوع: ${data.type === 'policy' ? 'سياسة' : data.type === 'faq' ? 'سؤال شائع' : 'دليل'}` : '',
      data.category ? `الفئة: ${data.category}` : '',
      `المحتوى: ${data.content}`,
    ]
      .filter(Boolean)
      .join('\n')
      .substring(0, 8000) // Limit to avoid token limits

    // Generate embedding
    const { values } = await generateEmbedding(searchableText, {
      taskType: 'RETRIEVAL_DOCUMENT',
    })

    // Store embedding in the data
    data.embedding = values

    const duration = Date.now() - startTime
    console.log(
      `[KnowledgeHook] Embedding generated for ${data.slug}: ${values.length} dimensions (${duration}ms)`
    )
  } catch (error) {
    console.error(`[KnowledgeHook] Error generating embedding for ${data.slug}:`, error)
    // Don't block save if embedding fails - log and continue
    // The embedding can be regenerated later
  }

  return data
}

/**
 * Utility function to regenerate all knowledge base embeddings
 * Useful for migration or when embedding model changes
 */
export async function regenerateAllKnowledgeEmbeddings(): Promise<{
  success: number
  failed: number
}> {
  // This will be called via an API endpoint or script
  // Import payload here to avoid circular dependencies
  const { getPayload } = await import('payload')
  const config = (await import('@/payload.config')).default

  const payload = await getPayload({ config })

  const entries = await payload.find({
    collection: 'knowledge-base',
    where: {
      isActive: { equals: true },
    },
    limit: 1000,
  })

  let success = 0
  let failed = 0

  console.log(`[KnowledgeHook] Regenerating embeddings for ${entries.docs.length} entries`)

  for (const entry of entries.docs) {
    try {
      const searchableText = [
        `العنوان: ${entry.title}`,
        entry.type
          ? `النوع: ${entry.type === 'policy' ? 'سياسة' : entry.type === 'faq' ? 'سؤال شائع' : 'دليل'}`
          : '',
        entry.category ? `الفئة: ${entry.category}` : '',
        `المحتوى: ${entry.content}`,
      ]
        .filter(Boolean)
        .join('\n')
        .substring(0, 8000)

      const { values } = await generateEmbedding(searchableText, {
        taskType: 'RETRIEVAL_DOCUMENT',
      })

      await payload.update({
        collection: 'knowledge-base',
        id: entry.id,
        data: {
          embedding: values,
        },
      })

      success++
      console.log(`[KnowledgeHook] Regenerated embedding for: ${entry.slug}`)

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 300))
    } catch (error) {
      failed++
      console.error(`[KnowledgeHook] Failed for ${entry.slug}:`, error)
    }
  }

  console.log(`[KnowledgeHook] Regeneration complete: ${success} success, ${failed} failed`)
  return { success, failed }
}
