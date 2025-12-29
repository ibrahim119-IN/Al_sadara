import { NextRequest, NextResponse } from 'next/server'
import {
  getCustomerConversations,
  deleteConversation,
  getConversationTokenUsage,
} from '@/lib/ai/memory/conversation-manager'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * AI Conversations Management API
 *
 * GET /api/ai/conversations?customerId=xxx
 * Get all conversations for a customer
 *
 * DELETE /api/ai/conversations?conversationId=xxx
 * Delete a conversation
 */

/**
 * Get customer conversations
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!customerId) {
      return NextResponse.json({ error: 'customerId is required' }, { status: 400 })
    }

    console.log('[ConversationsAPI] Getting conversations for customer:', customerId)

    const conversations = await getCustomerConversations(customerId, limit)

    return NextResponse.json({
      success: true,
      conversations,
      count: conversations.length,
    })
  } catch (error: any) {
    console.error('[ConversationsAPI] GET error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء جلب المحادثات',
      },
      { status: 500 }
    )
  }
}

/**
 * Delete a conversation
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
    }

    console.log('[ConversationsAPI] Deleting conversation:', conversationId)

    await deleteConversation(conversationId)

    return NextResponse.json({
      success: true,
      message: 'تم حذف المحادثة بنجاح',
    })
  } catch (error: any) {
    console.error('[ConversationsAPI] DELETE error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء حذف المحادثة',
      },
      { status: 500 }
    )
  }
}

/**
 * Get conversation statistics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId } = body

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
    }

    console.log('[ConversationsAPI] Getting stats for conversation:', conversationId)

    const payload = await getPayload({ config })

    // Get conversation
    const conversation = await payload.findByID({
      collection: 'ai-conversations',
      id: conversationId,
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Get token usage
    const tokensUsed = await getConversationTokenUsage(conversationId)

    return NextResponse.json({
      success: true,
      stats: {
        conversationId: conversation.id,
        sessionId: conversation.sessionId,
        messageCount: conversation.messageCount,
        createdAt: conversation.createdAt,
        lastMessageAt: conversation.lastMessageAt,
        tokensUsed,
        status: conversation.status,
      },
    })
  } catch (error: any) {
    console.error('[ConversationsAPI] POST error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء جلب إحصائيات المحادثة',
      },
      { status: 500 }
    )
  }
}
