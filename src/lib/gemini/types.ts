/**
 * TypeScript types for Gemini AI services
 */

// ===== Chat Types =====

export interface ChatMessage {
  role: 'user' | 'model'
  content: string
  timestamp?: Date
}

export interface GeminiContent {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export interface ChatOptions {
  systemPrompt?: string
  enableFunctions?: boolean
  enableGrounding?: boolean
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatResponse {
  text: string
  functionCalls?: FunctionCall[]
  groundingMetadata?: GroundingMetadata
  usage?: TokenUsage
}

export interface StreamChunk {
  type: 'text' | 'function_call' | 'grounding' | 'error'
  data: string | FunctionCall[] | GroundingMetadata | Error
}

// ===== Function Calling Types =====

export interface FunctionCall {
  name: string
  args: Record<string, unknown>
}

export interface FunctionResponse {
  name: string
  response: unknown
}

export interface FunctionDeclaration {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
    }>
    required?: string[]
  }
}

// ===== Grounding Types =====

export interface GroundingMetadata {
  searchEntryPoint?: {
    renderedContent: string
  }
  groundingChunks?: Array<{
    web?: {
      uri: string
      title: string
    }
  }>
  groundingSupports?: Array<{
    segment: {
      startIndex: number
      endIndex: number
      text: string
    }
    groundingChunkIndices: number[]
    confidenceScores: number[]
  }>
}

// ===== Embedding Types =====

export interface EmbeddingOptions {
  dimensions?: 768 | 1536 | 3072
  taskType?: 'RETRIEVAL_QUERY' | 'RETRIEVAL_DOCUMENT' | 'SEMANTIC_SIMILARITY' | 'CLASSIFICATION' | 'CLUSTERING'
}

export interface EmbeddingResult {
  values: number[]
  dimensions: number
}

export interface BatchEmbeddingResult {
  embeddings: EmbeddingResult[]
  totalTokens: number
}

// ===== Live API Types (Voice) =====

export type LiveModality = 'AUDIO' | 'TEXT'

export interface LiveSessionConfig {
  model?: string
  systemPrompt?: string
  responseModalities?: LiveModality[]
  enableFunctions?: boolean
  voiceConfig?: VoiceConfig
}

export interface VoiceConfig {
  voiceName?: string // e.g., 'Kore', 'Charon', 'Fenrir', etc.
  languageCode?: string // e.g., 'ar-EG', 'en-US'
}

export interface LiveMessage {
  type: 'text' | 'audio' | 'function_call' | 'function_response' | 'interrupted' | 'turn_complete'
  data?: string | ArrayBuffer | FunctionCall | FunctionCall[] | FunctionResponse
}

export interface LiveSession {
  send: (message: LiveMessage) => void
  sendText: (text: string) => void
  sendAudio: (audioData: ArrayBuffer) => void
  sendFunctionResponse: (response: FunctionResponse) => void
  close: () => void
  isConnected: () => boolean
}

export interface LiveSessionCallbacks {
  onMessage: (message: LiveMessage) => void
  onError: (error: Error) => void
  onOpen?: () => void
  onClose?: () => void
  onInterrupted?: () => void
}

// ===== Token Usage Types =====

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

// ===== Product Types (for function calling) =====

export interface ProductSearchParams {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  limit?: number
  offset?: number
}

export interface ProductResult {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  inStock: boolean
  rating?: number
  reviewCount?: number
}

export interface RecommendationParams {
  productId?: string
  userId?: string
  category?: string
  limit?: number
}

export interface CompareProductsParams {
  productIds: string[]
}

export interface OrderStatusParams {
  orderId: string
  email?: string
  phone?: string
}

export interface ShippingCalculationParams {
  governorate: string
  weight?: number
  orderTotal?: number
}

// ===== Conversation Types =====

export interface Conversation {
  id: string
  sessionId: string
  userId?: string
  messages: ChatMessage[]
  context?: ConversationContext
  createdAt: Date
  updatedAt: Date
}

export interface ConversationContext {
  currentProduct?: ProductResult
  cart?: CartItem[]
  preferences?: UserPreferences
  lastSearchQuery?: string
  lastResults?: ProductResult[]
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface UserPreferences {
  preferredCategories?: string[]
  priceRange?: { min: number; max: number }
  language?: string
}

// ===== Error Types =====

export class GeminiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

export const GeminiErrorCodes = {
  API_KEY_MISSING: 'API_KEY_MISSING',
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  FUNCTION_EXECUTION_ERROR: 'FUNCTION_EXECUTION_ERROR',
  LIVE_SESSION_ERROR: 'LIVE_SESSION_ERROR',
  EMBEDDING_ERROR: 'EMBEDDING_ERROR',
} as const

export type GeminiErrorCode = typeof GeminiErrorCodes[keyof typeof GeminiErrorCodes]
