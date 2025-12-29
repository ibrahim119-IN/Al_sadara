import { nanoid } from 'nanoid'
import type {
  ConversationContext,
  ConversationHistoryOptions,
  Message,
  AIMessageDoc,
} from '../types'
import type { AIConversation } from '@/payload-types'
import { withTimeout, TIMEOUTS } from '@/lib/utils/timeout'
import { getCachedPayload } from '@/lib/payload-client'

/**
 * Conversation Manager
 * Handles creation, retrieval, and management of AI conversations
 */

/**
 * Create a new conversation
 */
export async function createConversation(
  context: ConversationContext
): Promise<AIConversation> {
  try {
    const payload = await getCachedPayload()

    const sessionId = context.sessionId || nanoid()

    const conversation = await withTimeout(
      payload.create({
        collection: 'ai-conversations',
        data: {
          sessionId,
          customer: context.customerId ? String(context.customerId) : undefined,
          status: 'active',
          metadata: {
            locale: context.locale || 'ar',
            ...context.metadata,
          },
          messageCount: 0,
          lastMessageAt: new Date().toISOString(),
        },
      }),
      TIMEOUTS.DB_CREATE,
      '[ConversationManager] Create conversation timed out'
    )

    console.log(`[ConversationManager] Created conversation: ${conversation.id}`)

    return conversation
  } catch (error) {
    console.error('[ConversationManager] Error creating conversation:', error)
    throw error
  }
}

/**
 * Get or create a conversation by session ID
 */
export async function getOrCreateConversation(
  context: ConversationContext
): Promise<AIConversation> {
  try {
    const payload = await getCachedPayload()

    // Try to find existing conversation with timeout
    const existing = await withTimeout(
      payload.find({
        collection: 'ai-conversations',
        where: {
          sessionId: { equals: context.sessionId },
        },
        limit: 1,
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find conversation timed out'
    )

    if (existing.docs.length > 0) {
      console.log(`[ConversationManager] Found existing conversation: ${existing.docs[0].id}`)
      return existing.docs[0]
    }

    // Create new conversation
    return await createConversation(context)
  } catch (error) {
    console.error('[ConversationManager] Error getting/creating conversation:', error)
    throw error
  }
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string): Promise<AIConversation | null> {
  try {
    const payload = await getCachedPayload()

    const conversation = await withTimeout(
      payload.findByID({
        collection: 'ai-conversations',
        id: conversationId,
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find conversation by ID timed out'
    )

    return conversation
  } catch (error) {
    console.error(`[ConversationManager] Error getting conversation ${conversationId}:`, error)
    return null
  }
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  message: Message
): Promise<AIMessageDoc> {
  try {
    const payload = await getCachedPayload()

    // Create message with timeout
    const messageDoc = await withTimeout(
      payload.create({
        collection: 'ai-messages',
        data: {
          conversation: conversationId,
          role: message.role,
          content: message.content,
          functionCalls: message.functionCalls,
          functionResults: message.functionResults,
          metadata: message.metadata,
          tokensUsed: message.tokensUsed,
        },
      }),
      TIMEOUTS.DB_CREATE,
      '[ConversationManager] Create message timed out'
    )

    // Update conversation with timeout
    const conversation = await withTimeout(
      payload.findByID({
        collection: 'ai-conversations',
        id: conversationId,
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find conversation timed out'
    )

    await withTimeout(
      payload.update({
        collection: 'ai-conversations',
        id: conversationId,
        data: {
          messageCount: (conversation.messageCount || 0) + 1,
          lastMessageAt: new Date().toISOString(),
          // Auto-generate title from first user message
          title:
            !conversation.title && message.role === 'user'
              ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
              : conversation.title,
        },
      }),
      TIMEOUTS.DB_UPDATE,
      '[ConversationManager] Update conversation timed out'
    )

    console.log(`[ConversationManager] Added ${message.role} message to conversation ${conversationId}`)

    return messageDoc
  } catch (error) {
    console.error('[ConversationManager] Error adding message:', error)
    throw error
  }
}

/**
 * Get conversation history
 */
export async function getConversationHistory(
  conversationId: string,
  options: ConversationHistoryOptions = {}
): Promise<Message[]> {
  try {
    const payload = await getCachedPayload()

    const { limit = 20, offset = 0, includeSystem = false } = options

    // Build where clause
    const where: any = {
      conversation: { equals: conversationId },
    }

    if (!includeSystem) {
      where.role = { not_equals: 'system' }
    }

    // Fetch messages with timeout
    const messages = await withTimeout(
      payload.find({
        collection: 'ai-messages',
        where,
        limit,
        page: Math.floor(offset / limit) + 1,
        sort: '-createdAt', // Most recent first
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find messages timed out'
    )

    // Convert to Message format and reverse (oldest first)
    const messageList: Message[] = messages.docs
      .map((doc) => ({
        role: doc.role as 'user' | 'assistant' | 'system',
        content: doc.content || '',
        functionCalls: doc.functionCalls,
        functionResults: doc.functionResults,
        metadata: doc.metadata,
        tokensUsed: doc.tokensUsed,
      }))
      .reverse()

    console.log(
      `[ConversationManager] Retrieved ${messageList.length} messages for conversation ${conversationId}`
    )

    return messageList
  } catch (error) {
    console.error('[ConversationManager] Error getting conversation history:', error)
    throw error
  }
}

/**
 * Get conversations for a customer
 */
export async function getCustomerConversations(
  customerId: string,
  limit: number = 10
): Promise<AIConversation[]> {
  try {
    const payload = await getCachedPayload()

    const conversations = await withTimeout(
      payload.find({
        collection: 'ai-conversations',
        where: {
          customer: { equals: customerId },
        },
        limit,
        sort: '-lastMessageAt',
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find customer conversations timed out'
    )

    console.log(`[ConversationManager] Found ${conversations.docs.length} conversations for customer ${customerId}`)

    return conversations.docs
  } catch (error) {
    console.error('[ConversationManager] Error getting customer conversations:', error)
    throw error
  }
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'archived' | 'deleted'
): Promise<void> {
  try {
    const payload = await getCachedPayload()

    await withTimeout(
      payload.update({
        collection: 'ai-conversations',
        id: conversationId,
        data: {
          status,
        },
      }),
      TIMEOUTS.DB_UPDATE,
      '[ConversationManager] Update conversation status timed out'
    )

    console.log(`[ConversationManager] Updated conversation ${conversationId} status to ${status}`)
  } catch (error) {
    console.error('[ConversationManager] Error updating conversation status:', error)
    throw error
  }
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    const payload = await getCachedPayload()

    // Delete all messages
    const messages = await withTimeout(
      payload.find({
        collection: 'ai-messages',
        where: {
          conversation: { equals: conversationId },
        },
        limit: 1000,
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find messages for deletion timed out'
    )

    for (const message of messages.docs) {
      await withTimeout(
        payload.delete({
          collection: 'ai-messages',
          id: message.id,
        }),
        TIMEOUTS.DB_UPDATE,
        '[ConversationManager] Delete message timed out'
      )
    }

    // Delete conversation
    await withTimeout(
      payload.delete({
        collection: 'ai-conversations',
        id: conversationId,
      }),
      TIMEOUTS.DB_UPDATE,
      '[ConversationManager] Delete conversation timed out'
    )

    console.log(`[ConversationManager] Deleted conversation ${conversationId} and ${messages.docs.length} messages`)
  } catch (error) {
    console.error('[ConversationManager] Error deleting conversation:', error)
    throw error
  }
}

/**
 * Get total token usage for a conversation
 */
export async function getConversationTokenUsage(conversationId: string): Promise<number> {
  try {
    const payload = await getCachedPayload()

    const messages = await withTimeout(
      payload.find({
        collection: 'ai-messages',
        where: {
          conversation: { equals: conversationId },
        },
        limit: 1000,
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find messages for token usage timed out'
    )

    const totalTokens = messages.docs.reduce((sum, msg) => sum + (msg.tokensUsed || 0), 0)

    return totalTokens
  } catch (error) {
    console.error('[ConversationManager] Error calculating token usage:', error)
    return 0
  }
}

/**
 * Summarize old messages in a conversation to save context
 */
export async function summarizeConversation(conversationId: string): Promise<string> {
  try {
    const messages = await getConversationHistory(conversationId, {
      limit: 50,
      includeSystem: false,
    })

    if (messages.length === 0) {
      return ''
    }

    // Create a simple summary
    const userMessages = messages.filter((m) => m.role === 'user')
    const summary = `محادثة سابقة تحتوي على ${userMessages.length} سؤال من العميل حول المنتجات والخدمات.`

    return summary
  } catch (error) {
    console.error('[ConversationManager] Error summarizing conversation:', error)
    return ''
  }
}

/**
 * Clean up old archived conversations
 */
export async function cleanupOldConversations(daysOld: number = 30): Promise<number> {
  try {
    const payload = await getCachedPayload()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const oldConversations = await withTimeout(
      payload.find({
        collection: 'ai-conversations',
        where: {
          and: [
            { status: { equals: 'archived' } },
            { lastMessageAt: { less_than: cutoffDate.toISOString() } },
          ],
        },
        limit: 1000,
      }),
      TIMEOUTS.DB_QUERY,
      '[ConversationManager] Find old conversations timed out'
    )

    let deletedCount = 0

    for (const conversation of oldConversations.docs) {
      await deleteConversation(conversation.id)
      deletedCount++
    }

    console.log(`[ConversationManager] Cleaned up ${deletedCount} old conversations`)

    return deletedCount
  } catch (error) {
    console.error('[ConversationManager] Error cleaning up conversations:', error)
    return 0
  }
}
