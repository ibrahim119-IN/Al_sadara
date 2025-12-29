import { NextRequest, NextResponse } from 'next/server'
import { getConversationHistory } from '@/lib/ai/memory/conversation-manager'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Single Conversation Management
 *
 * GET /api/ai/conversations/[id]
 * Get a specific conversation with its messages
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    console.log('[ConversationAPI] Getting conversation:', id)

    const payload = await getPayload({ config })

    // Get conversation
    const conversation = await payload.findByID({
      collection: 'ai-conversations',
      id,
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Get messages
    const messages = await getConversationHistory(id, {
      limit: 100,
      includeSystem: false,
    })

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        sessionId: conversation.sessionId,
        title: conversation.title,
        status: conversation.status,
        messageCount: conversation.messageCount,
        createdAt: conversation.createdAt,
        lastMessageAt: conversation.lastMessageAt,
        messages,
      },
    })
  } catch (error: any) {
    console.error('[ConversationAPI] GET error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء جلب المحادثة',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/ai/conversations/[id]
 * Update conversation (e.g., change title, archive)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    console.log('[ConversationAPI] Updating conversation:', id)

    const payload = await getPayload({ config })

    const updateData: any = {}
    if (title) updateData.title = title
    if (status) updateData.status = status

    const conversation = await payload.update({
      collection: 'ai-conversations',
      id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      conversation,
    })
  } catch (error: any) {
    console.error('[ConversationAPI] PATCH error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء تحديث المحادثة',
      },
      { status: 500 }
    )
  }
}
