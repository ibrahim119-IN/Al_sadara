'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Message } from '@/lib/ai/types'
import { useCart } from '@/lib/cart/CartContext'

/**
 * AI Assistant Context
 * Global state management for AI chat functionality
 */

/**
 * Page Context - tells the AI which page the user is viewing
 */
export interface PageContext {
  pageName: 'home' | 'company' | 'product' | 'products' | 'contact' | 'about' | 'other'
  companySlug?: string // If viewing a specific company page
  productId?: string // If viewing a specific product
  locale: 'ar' | 'en'
}

interface AIAssistantContextType {
  // Current conversation state
  sessionId: string | null
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null

  // Page context - where the user is in the site
  pageContext: PageContext | null
  setPageContext: (context: PageContext) => void

  // Conversation management
  startNewConversation: () => void
  loadConversation: (sessionId: string) => Promise<void>
  getConversationHistory: () => Message[]

  // Chat functions
  sendMessage: (message: string) => Promise<void>
  clearMessages: () => void
  clearError: () => void

  // UI state
  isChatOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [pageContext, setPageContextState] = useState<PageContext | null>(null)

  // Get cart items to send with AI requests
  const { items: cartItems } = useCart()

  // Set page context - called by pages to tell AI where user is
  const setPageContext = useCallback((context: PageContext) => {
    setPageContextState(context)
  }, [])

  // Generate session ID on mount
  useEffect(() => {
    // Check if session ID exists in localStorage
    const storedSessionId = localStorage.getItem('ai_session_id')

    if (storedSessionId) {
      setSessionId(storedSessionId)
      // Load conversation history
      loadConversationFromStorage(storedSessionId)
    } else {
      // Generate new session ID
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      localStorage.setItem('ai_session_id', newSessionId)
    }
  }, [])

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }, [])

  // Start new conversation
  const startNewConversation = useCallback(() => {
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    setMessages([])
    setError(null)
    localStorage.setItem('ai_session_id', newSessionId)
    localStorage.removeItem('ai_messages')
  }, [generateSessionId])

  // Load conversation from localStorage
  const loadConversationFromStorage = useCallback((sessionId: string) => {
    try {
      const storedMessages = localStorage.getItem('ai_messages')
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages)
        setMessages(parsed)
      }
    } catch (error) {
      console.error('[AIContext] Error loading messages from storage:', error)
    }
  }, [])

  // Load conversation from server
  const loadConversation = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/ai/chat?sessionId=${sessionId}`)

      if (!response.ok) {
        throw new Error('Failed to load conversation')
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setSessionId(sessionId)
      localStorage.setItem('ai_session_id', sessionId)
      localStorage.setItem('ai_messages', JSON.stringify(data.messages || []))
    } catch (error: any) {
      console.error('[AIContext] Error loading conversation:', error)
      setError(error.message || 'فشل تحميل المحادثة')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get conversation history
  const getConversationHistory = useCallback(() => {
    return messages
  }, [messages])

  // Send message to AI
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !sessionId) return

      // ✅ FIX: Track stream completion and timeout
      let streamCompleted = false
      let streamTimeout: NodeJS.Timeout | null = null

      try {
        setIsLoading(true)
        setIsStreaming(true)
        setError(null)

        // Add user message to UI immediately
        const userMessage: Message = {
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // ✅ ADD: Unique ID
          role: 'user',
          content: message,
        }

        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)

        // Save to localStorage
        localStorage.setItem('ai_messages', JSON.stringify(updatedMessages))

        // Get customer ID from auth context if available
        // For now, we'll pass null for guest users
        const customerId = null // TODO: Get from useAuth() when auth is integrated

        // ✅ FIX: Set timeout for stream (45 seconds)
        streamTimeout = setTimeout(() => {
          if (!streamCompleted) {
            console.error('[AIContext] Stream timeout - no response after 45 seconds')
            setError('انتهى وقت الانتظار. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.')
            setIsLoading(false)
            setIsStreaming(false)
          }
        }, 45000)

        // Transform cart items to API format
        const apiCartItems = cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
        }))

        // Call API with streaming
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            sessionId,
            customerId,
            locale: pageContext?.locale || 'ar',
            cartItems: apiCartItems, // Pass transformed cart items
            pageContext, // Pass current page context to AI
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('[AIContext] API error:', errorText)

          // Parse error for better user message
          let userErrorMessage = 'فشل إرسال الرسالة'
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.error) {
              if (errorData.error.includes('timed out')) {
                userErrorMessage = 'انتهى وقت الانتظار. قد يكون الخادم مشغولاً، يرجى المحاولة مرة أخرى.'
              } else if (errorData.error.includes('rate limit') || response.status === 429) {
                userErrorMessage = errorData.error // Use Arabic error from API
              } else {
                userErrorMessage = errorData.error
              }
            }
          } catch {
            // If error is not JSON, use default message
            if (response.status === 500) {
              userErrorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
            } else if (response.status === 503) {
              userErrorMessage = 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.'
            }
          }

          throw new Error(userErrorMessage)
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No reader available')
        }

        let assistantMessage = ''
        let assistantMessageAdded = false
        let visualData: any = null // ✅ ADD: Store visual data from functions

        // ✅ FIX: Wrap streaming in try-catch with detailed error logging
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              console.log('[AIContext] Stream completed successfully')
              streamCompleted = true
              break
            }

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6)

                if (data === '[DONE]') {
                  console.log('[AIContext] Received [DONE] signal')
                  setIsStreaming(false)
                  streamCompleted = true
                  break
                }

                try {
                  const parsed = JSON.parse(data)

                  // ✅ ADD: Handle visual data
                  if (parsed.type === 'visual' && parsed.data) {
                    console.log('[AIContext] Received visual data:', parsed.data)
                    visualData = parsed.data
                  }

                  if (parsed.text) {
                    assistantMessage += parsed.text

                    // ✅ FIX: Use functional update with prev to preserve all messages
                    setMessages((prev) => {
                      // Check if user message exists in prev
                      const userMessageExists = prev.some(
                        (m) => m.role === 'user' && m.content === message
                      )

                      if (!assistantMessageAdded) {
                        assistantMessageAdded = true

                        // If user message was lost, restore it
                        const baseMessages = userMessageExists
                          ? prev
                          : [...prev, userMessage]

                        return [
                          ...baseMessages,
                          {
                            id: `assistant_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                            role: 'assistant' as const,
                            content: assistantMessage,
                            ...visualData,
                          },
                        ]
                      } else {
                        // Update last message (assistant message) - keep same ID
                        const newMessages = [...prev]
                        const lastMessage = newMessages[newMessages.length - 1]
                        newMessages[newMessages.length - 1] = {
                          ...lastMessage,
                          role: 'assistant' as const,
                          content: assistantMessage,
                          ...visualData,
                        }
                        return newMessages
                      }
                    })
                  }

                  if (parsed.error) {
                    console.error('[AIContext] Error from API:', parsed.error)
                    setError(parsed.error)
                  }
                } catch (parseError) {
                  // ✅ FIX: Log parse errors but only for non-empty chunks
                  if (data.trim()) {
                    console.warn('[AIContext] Failed to parse chunk:', data, parseError)
                  }
                }
              }
            }
          }
        } catch (streamError: any) {
          // ✅ FIX: Catch and log streaming errors
          console.error('[AIContext] Streaming error:', streamError)
          throw new Error('حدث خطأ أثناء استقبال الرد: ' + streamError.message)
        }

        // ✅ FIX: Check if we received any response
        if (!assistantMessage && !streamCompleted) {
          console.error('[AIContext] No response received from AI')
          throw new Error('لم يتم استقبال أي رد من المساعد الذكي')
        }

        // Save final messages to localStorage
        const finalMessages = [
          ...updatedMessages,
          {
            id: `assistant_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // ✅ ADD: Unique ID
            role: 'assistant' as const,
            content: assistantMessage,
          },
        ]
        localStorage.setItem('ai_messages', JSON.stringify(finalMessages))

        console.log('[AIContext] Message sent successfully, total messages:', finalMessages.length)
      } catch (error: any) {
        console.error('[AIContext] Error sending message:', error)
        setError(error.message || 'فشل إرسال الرسالة')

        // ✅ FIX: Ensure user message is still visible even on error
        setMessages((prev) => {
          // If last message is not from user, the user message was lost - restore it
          if (prev.length === 0 || prev[prev.length - 1].role !== 'user') {
            return [
              ...prev,
              {
                id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // ✅ ADD: Unique ID
                role: 'user',
                content: message,
              },
            ]
          }
          return prev
        })
      } finally {
        // ✅ FIX: Clear timeout
        if (streamTimeout) {
          clearTimeout(streamTimeout)
        }
        setIsLoading(false)
        setIsStreaming(false)
      }
    },
    [messages, sessionId, cartItems, pageContext]
  )

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([])
    localStorage.removeItem('ai_messages')
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // UI state management
  const openChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev)
  }, [])

  const value: AIAssistantContextType = {
    sessionId,
    messages,
    isLoading,
    isStreaming,
    error,
    pageContext,
    setPageContext,
    startNewConversation,
    loadConversation,
    getConversationHistory,
    sendMessage,
    clearMessages,
    clearError,
    isChatOpen,
    openChat,
    closeChat,
    toggleChat,
  }

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>
}

/**
 * Hook to use AI Assistant Context
 */
export function useAIAssistant() {
  const context = useContext(AIAssistantContext)

  if (!context) {
    throw new Error('useAIAssistant must be used within AIAssistantProvider')
  }

  return context
}
