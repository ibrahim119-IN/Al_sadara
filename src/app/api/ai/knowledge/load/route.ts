import { NextRequest, NextResponse } from 'next/server'
import { loadKnowledgeBase } from '@/scripts/load-knowledge-base'

/**
 * API endpoint to load knowledge base
 * GET /api/ai/knowledge/load
 *
 * Loads all markdown files from knowledge-base directory
 * and generates embeddings
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Loading knowledge base...')

    await loadKnowledgeBase()

    return NextResponse.json({
      success: true,
      message: 'Knowledge base loaded successfully',
    })
  } catch (error: any) {
    console.error('[API] Error loading knowledge base:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to load knowledge base',
      },
      { status: 500 }
    )
  }
}
