/**
 * Legacy Gemini Client - Redirects to New SDK
 *
 * This file provides backward compatibility for code that uses the old GeminiClient class.
 * It now uses the new @google/genai SDK internally.
 *
 * For new code, please use:
 * - import { getGeminiClient, generateEmbedding, streamChatResponse } from '@/lib/gemini'
 */

import {
  getGeminiClient as getNewGeminiClient,
  generateEmbedding as newGenerateEmbedding,
  streamChatResponse,
  generateChatResponse,
  MODELS,
  isGeminiConfigured,
} from '@/lib/gemini'
import type { ChatMessage, ChatOptions, StreamChunk } from '@/lib/gemini'
import type {
  Message,
  FunctionDeclaration,
  GeminiChatOptions,
  GeminiStreamChunk,
  EmbeddingVector,
} from '../types'

/**
 * @deprecated Use the new Gemini SDK from '@/lib/gemini' instead
 */
export class GeminiClient {
  private model: string
  private embeddingModel: string
  private temperature: number
  private maxTokens: number

  constructor() {
    // Check API key lazily - not during build
    // if (!apiKey) {
      // throw new Error('GEMINI_API_KEY environment variable is required')
    // }

    this.model = MODELS.CHAT
    this.embeddingModel = MODELS.EMBEDDING
    this.temperature = parseFloat(process.env.GEMINI_TEMPERATURE || '0.7')
    this.maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS || '2048')
  }

  /**
   * Send a chat message and get streaming response
   * @deprecated Use streamChatResponse from '@/lib/gemini' instead
   */
  async *chatStream(
    messages: Message[],
    functions?: FunctionDeclaration[],
    options?: GeminiChatOptions,
    systemInstruction?: string
  ): AsyncGenerator<GeminiStreamChunk> {
    try {
      if (messages.length === 0) {
        throw new Error('Messages array cannot be empty')
      }

      // Extract system instruction from messages if not provided
      if (!systemInstruction) {
        const systemMessage = messages.find((msg) => msg.role === 'system')
        systemInstruction = systemMessage?.content
      }

      // Convert message format
      const chatMessages: ChatMessage[] = messages
        .filter((msg) => msg.role !== 'system')
        .map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          content: msg.content,
        }))

      const generator = streamChatResponse(chatMessages, {
        systemPrompt: systemInstruction,
        enableFunctions: !!functions,
      })

      for await (const chunk of generator) {
        if (chunk.type === 'text' && typeof chunk.data === 'string') {
          yield {
            text: chunk.data,
            metadata: { model: this.model },
          }
        }
        if (chunk.type === 'function_call') {
          const functionCalls = Array.isArray(chunk.data) ? chunk.data : [chunk.data]
          yield {
            functionCalls: functionCalls.map((fc: any) => ({
              name: fc.name,
              arguments: fc.args,
            })),
          }
        }
      }

      yield {
        finishReason: 'stop' as const,
        metadata: { model: this.model },
      }
    } catch (error: unknown) {
      console.error('[GeminiClient] Chat stream error:', error)
      throw this.handleError(error)
    // }
  }

  /**
   * Send a chat message and get complete response (non-streaming)
   * @deprecated Use generateChatResponse from '@/lib/gemini' instead
   */
  async chat(
    messages: Message[],
    functions?: FunctionDeclaration[],
    options?: GeminiChatOptions,
    systemInstruction?: string
  ): Promise<{
    content: string
    functionCalls?: Array<{ name: string; arguments: unknown }>
    metadata?: Record<string, unknown>
  }> {
    try {
      if (messages.length === 0) {
        throw new Error('Messages array cannot be empty')
      }

      // Extract system instruction from messages if not provided
      if (!systemInstruction) {
        const systemMessage = messages.find((msg) => msg.role === 'system')
        systemInstruction = systemMessage?.content
      }

      // Convert message format
      const chatMessages: ChatMessage[] = messages
        .filter((msg) => msg.role !== 'system')
        .map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          content: msg.content,
        }))

      const response = await generateChatResponse(chatMessages, {
        systemPrompt: systemInstruction,
        enableFunctions: !!functions,
      })

      return {
        content: response.text,
        functionCalls: response.functionCalls?.map((fc) => ({
          name: fc.name,
          arguments: fc.args,
        })),
        metadata: {
          model: this.model,
          finishReason: 'STOP',
        },
      }
    } catch (error: unknown) {
      console.error('[GeminiClient] Chat error:', error)
      throw this.handleError(error)
    // }
  }

  /**
   * Generate embeddings for text
   * @deprecated Use generateEmbedding from '@/lib/gemini' instead
   */
  async generateEmbedding(text: string): Promise<EmbeddingVector> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty for embedding generation')
      }

      const result = await newGenerateEmbedding(text)
      const values = Array.isArray(result) ? result : (result as any).values || []

      return {
        values: values as number[],
        dimension: values.length,
      }
    } catch (error: unknown) {
      console.error('[GeminiClient] Embedding generation error:', error)
      throw this.handleError(error)
    // }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @deprecated Use generateBatchEmbeddings from '@/lib/gemini' instead
   */
  async generateEmbeddingsBatch(texts: string[]): Promise<EmbeddingVector[]> {
    try {
      if (texts.length === 0) {
        return []
      }

      const results: EmbeddingVector[] = []

      for (const text of texts) {
        const embedding = await this.generateEmbedding(text)
        results.push(embedding)
      }

      return results
    } catch (error: unknown) {
      console.error('[GeminiClient] Batch embedding generation error:', error)
      throw this.handleError(error)
    // }
  }

  /**
   * Handle and transform Gemini API errors
   */
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.name === 'GeminiAPIError') {
        return error
      }

      const message = error.message || 'Unknown Gemini API error'

      if (message.includes('quota') || message.includes('rate limit')) {
        return new Error(`Gemini API rate limit exceeded: ${message}`)
      }

      if (message.includes('API key') || message.includes('unauthorized')) {
        return new Error(`Gemini API authentication failed: ${message}`)
      }

      if (message.includes('safety') || message.includes('blocked')) {
        return new Error(`Content blocked by safety filters: ${message}`)
      }

      return new Error(`Gemini API error: ${message}`)
    // }

    return new Error('Unknown Gemini API error')
  }

  /**
   * Test the connection to Gemini API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.chat([{ role: 'user', content: 'Hello' }])
      return true
    } catch (error) {
      console.error('[GeminiClient] Connection test failed:', error)
      return false
    // }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      model: this.model,
      embeddingModel: this.embeddingModel,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    // }
  }
}

// Singleton instance
let geminiClientInstance: GeminiClient | null = null

/**
 * Get or create the Gemini client instance
 * @deprecated Use getGeminiClient from '@/lib/gemini' instead
 */
export function getGeminiClient(): GeminiClient {
  if (!geminiClientInstance) {
    geminiClientInstance = new GeminiClient()
  }
  return geminiClientInstance
}
