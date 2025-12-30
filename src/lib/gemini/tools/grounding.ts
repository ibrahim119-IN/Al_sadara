/**
 * Google Search Grounding Tools
 * Reduces hallucinations by grounding responses in search results
 */
import { GroundingMetadata } from '../types'

/**
 * Format grounding metadata for display
 */
export function formatGroundingMetadata(metadata?: GroundingMetadata): {
  hasGrounding: boolean
  sources: Array<{ title: string; url: string }>
  renderedContent?: string
} {
  if (!metadata) {
    return { hasGrounding: false, sources: [] }
  }

  const sources: Array<{ title: string; url: string }> = []

  // Extract sources from grounding chunks
  if (metadata.groundingChunks) {
    for (const chunk of metadata.groundingChunks) {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title,
          url: chunk.web.uri,
        })
      }
    }
  }

  return {
    hasGrounding: sources.length > 0,
    sources,
    renderedContent: metadata.searchEntryPoint?.renderedContent,
  }
}

/**
 * Get grounding configuration for different use cases
 */
export const GROUNDING_CONFIGS = {
  // For product information that might need external verification
  PRODUCT_INFO: {
    enabled: true,
    description: 'معلومات المنتج والمواصفات التقنية',
  },

  // For shipping and delivery information
  SHIPPING_INFO: {
    enabled: true,
    description: 'معلومات الشحن والتوصيل',
  },

  // For general shopping queries
  SHOPPING: {
    enabled: false, // Usually don't need external search for shopping
    description: 'استفسارات التسوق العامة',
  },

  // For comparing with market prices
  PRICE_COMPARISON: {
    enabled: true,
    description: 'مقارنة الأسعار في السوق',
  },
} as const

/**
 * Check if a query might benefit from grounding
 */
export function shouldUseGrounding(query: string): boolean {
  const groundingKeywords = [
    // Technical specs
    'مواصفات',
    'تقنية',
    'specifications',
    'specs',
    // Comparisons
    'مقارنة',
    'compare',
    'versus',
    'vs',
    // Market info
    'سعر السوق',
    'market price',
    // Verification
    'أصلي',
    'genuine',
    'authentic',
    // External info
    'تقييم',
    'review',
    'rating',
  ]

  const lowerQuery = query.toLowerCase()
  return groundingKeywords.some((keyword) =>
    lowerQuery.includes(keyword.toLowerCase())
  )
}

/**
 * Extract and highlight grounded segments in response
 */
export function highlightGroundedContent(
  text: string,
  metadata?: GroundingMetadata
): string {
  if (!metadata?.groundingSupports) {
    return text
  }

  // Sort supports by start index (descending) to insert markers from end
  const sortedSupports = [...metadata.groundingSupports].sort(
    (a, b) => b.segment.startIndex - a.segment.startIndex
  )

  let highlightedText = text

  for (const support of sortedSupports) {
    const { segment } = support

    // Only highlight high-confidence grounding
    const avgConfidence =
      support.confidenceScores.reduce((a, b) => a + b, 0) /
      support.confidenceScores.length

    if (avgConfidence >= 0.7) {
      const before = highlightedText.slice(0, segment.startIndex)
      const grounded = highlightedText.slice(segment.startIndex, segment.endIndex)
      const after = highlightedText.slice(segment.endIndex)

      // Add subtle marker for grounded content
      highlightedText = `${before}[${grounded}]${after}`
    }
  }

  return highlightedText
}

/**
 * Generate a citation block from grounding metadata
 */
export function generateCitations(metadata?: GroundingMetadata): string {
  const { hasGrounding, sources } = formatGroundingMetadata(metadata)

  if (!hasGrounding || sources.length === 0) {
    return ''
  }

  const citationLines = sources.map(
    (source, index) => `[${index + 1}] ${source.title}: ${source.url}`
  )

  return `\n\n**المصادر:**\n${citationLines.join('\n')}`
}
