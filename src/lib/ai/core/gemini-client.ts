import { GoogleGenerativeAI, type GenerativeModel, type ChatSession } from '@google/generative-ai'
import type {
  Message,
  FunctionDeclaration,
  GeminiChatOptions,
  GeminiStreamChunk,
  EmbeddingVector,
  GeminiAPIError,
} from '../types'

/**
 * Gemini API Client
 * Handles all interactions with Google's Gemini API including:
 * - Chat completion with streaming
 * - Function calling
 * - Embeddings generation
 * - Error handling and retry logic
 */
export class GeminiClient {
  private genAI: GoogleGenerativeAI
  private model: string
  private embeddingModel: string
  private temperature: number
  private maxTokens: number

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-pro'
    this.embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004'
    this.temperature = parseFloat(process.env.GEMINI_TEMPERATURE || '0.7')
    this.maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS || '2048')
  }

  /**
   * Initialize a chat session with message history
   */
  private createChatSession(
    history: Message[],
    functions?: FunctionDeclaration[],
    options?: GeminiChatOptions,
    systemInstruction?: string
  ): ChatSession {
    const model = this.genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: options?.temperature ?? this.temperature,
        maxOutputTokens: options?.maxOutputTokens ?? this.maxTokens,
        topK: options?.topK,
        topP: options?.topP,
        stopSequences: options?.stopSequences,
      },
      tools: functions
        ? [
            {
              functionDeclarations: functions,
            },
          ]
        : undefined,
    })

    // Convert our message format to Gemini format
    // Filter out system messages as they're handled by systemInstruction
    const geminiHistory = history
      .slice(0, -1)
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      }))

    return model.startChat({
      history: geminiHistory,
    })
  }

  /**
   * Send a chat message and get streaming response
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

      // Filter out system messages
      const filteredMessages = messages.filter((msg) => msg.role !== 'system')

      const chat = this.createChatSession(
        filteredMessages.slice(0, -1),
        functions,
        options,
        systemInstruction
      )
      const lastMessage = filteredMessages[filteredMessages.length - 1]

      const result = await chat.sendMessageStream(lastMessage.content)

      for await (const chunk of result.stream) {
        const text = chunk.text()
        const functionCalls = chunk.functionCalls()

        if (text) {
          yield {
            text,
            metadata: {
              model: this.model,
            },
          }
        }

        if (functionCalls && functionCalls.length > 0) {
          yield {
            functionCalls: functionCalls.map((fc) => ({
              name: fc.name,
              arguments: fc.args,
            })),
          }
        }
      }

      // Get final response with finish reason
      const response = await result.response
      const finishReason = response.candidates?.[0]?.finishReason

      yield {
        finishReason: finishReason as any,
        metadata: {
          model: this.model,
        },
      }
    } catch (error: any) {
      console.error('[GeminiClient] Chat stream error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Send a chat message and get complete response (non-streaming)
   */
  async chat(
    messages: Message[],
    functions?: FunctionDeclaration[],
    options?: GeminiChatOptions,
    systemInstruction?: string
  ): Promise<{
    content: string
    functionCalls?: any[]
    metadata?: Record<string, any>
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

      // Filter out system messages
      const filteredMessages = messages.filter((msg) => msg.role !== 'system')

      const chat = this.createChatSession(
        filteredMessages.slice(0, -1),
        functions,
        options,
        systemInstruction
      )
      const lastMessage = filteredMessages[filteredMessages.length - 1]

      const result = await chat.sendMessage(lastMessage.content)
      const response = result.response

      return {
        content: response.text(),
        functionCalls: response.functionCalls(),
        metadata: {
          model: this.model,
          finishReason: response.candidates?.[0]?.finishReason,
        },
      }
    } catch (error: any) {
      console.error('[GeminiClient] Chat error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(text: string): Promise<EmbeddingVector> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty for embedding generation')
      }

      const model = this.genAI.getGenerativeModel({
        model: this.embeddingModel,
      })

      const result = await model.embedContent(text)
      const values = result.embedding.values

      return {
        values,
        dimension: values.length,
      }
    } catch (error: any) {
      console.error('[GeminiClient] Embedding generation error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateEmbeddingsBatch(texts: string[]): Promise<EmbeddingVector[]> {
    try {
      if (texts.length === 0) {
        return []
      }

      // Process in batches to avoid rate limits
      const batchSize = 10
      const results: EmbeddingVector[] = []

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize)
        const batchResults = await Promise.all(batch.map((text) => this.generateEmbedding(text)))
        results.push(...batchResults)

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < texts.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      return results
    } catch (error: any) {
      console.error('[GeminiClient] Batch embedding generation error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle and transform Gemini API errors
   */
  private handleError(error: any): Error {
    // Check if it's already our custom error
    if (error.name === 'GeminiAPIError') {
      return error
    }

    // Transform Gemini API errors
    const message = error?.message || 'Unknown Gemini API error'
    const code = error?.status || error?.code || 'UNKNOWN'

    // Rate limiting
    if (code === 429 || message.includes('quota') || message.includes('rate limit')) {
      return new Error(`Gemini API rate limit exceeded: ${message}`)
    }

    // Authentication errors
    if (code === 401 || code === 403 || message.includes('API key')) {
      return new Error(`Gemini API authentication failed: ${message}`)
    }

    // Safety/content filtering
    if (message.includes('safety') || message.includes('blocked')) {
      return new Error(`Content blocked by safety filters: ${message}`)
    }

    // Generic API error
    return new Error(`Gemini API error: ${message}`)
  }

  /**
   * Test the connection to Gemini API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.chat([
        {
          role: 'user',
          content: 'Hello',
        },
      ])
      return true
    } catch (error) {
      console.error('[GeminiClient] Connection test failed:', error)
      return false
    }
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
    }
  }
}

// Singleton instance
let geminiClientInstance: GeminiClient | null = null

/**
 * Get or create the Gemini client instance
 */
export function getGeminiClient(): GeminiClient {
  if (!geminiClientInstance) {
    geminiClientInstance = new GeminiClient()
  }
  return geminiClientInstance
}
