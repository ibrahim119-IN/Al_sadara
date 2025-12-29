'use client'

import type { Message as MessageType } from '@/lib/ai/types'
import { Message } from './Message'

/**
 * Message List Component
 * Displays all messages in the conversation
 */

interface MessageListProps {
  messages: MessageType[]
  locale: 'ar' | 'en'
}

export function MessageList({ messages, locale }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        // ✅ FIX: Use message.id if available, fallback to index for backward compatibility
        <Message
          key={message.id || `msg_${index}_${message.role}_${message.content.substring(0, 20)}`}
          message={message}
          locale={locale}
        />
      ))}
    </div>
  )
}
