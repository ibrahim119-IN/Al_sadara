import type { AIConversation, AIMessage, Customer, Product } from '@/payload-types'

// ==================== MESSAGE TYPES ====================

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id?: string // ✅ ADD: Unique identifier for React key
  role: MessageRole
  content: string
  functionCalls?: FunctionCall[]
  functionResults?: FunctionResult[]
  metadata?: Record<string, any>
  tokensUsed?: number
  // ✅ ADD: Visual components data
  products?: Product[] // For displaying product cards
  comparison?: {
    products: Product[]
    aspects?: string[]
  } // For comparison table
  budgetSolution?: {
    budget: number
    items: Array<{
      product: Product
      quantity: number
      subtotal: number
    }>
    totalCost: number
    alternatives?: Array<{
      product: Product
      quantity: number
      subtotal: number
    }>[]
    notes?: string
  } // For budget solution display
}

export interface AIMessageDoc extends Omit<AIMessage, 'conversation'> {
  conversation: string | AIConversation
}

// ==================== FUNCTION CALLING TYPES ====================

export interface FunctionCall {
  name: string
  arguments: Record<string, any>
}

export interface FunctionResult {
  name: string
  result: any
  error?: string
}

export interface FunctionDeclaration {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description?: string
      enum?: string[]
      items?: any
      properties?: any
      required?: string[]
    }>
    required?: string[]
  }
}

// ==================== CONVERSATION TYPES ====================

export interface ConversationContext {
  sessionId: string
  customerId?: string | number
  locale?: 'ar' | 'en'
  metadata?: Record<string, any>
}

export interface ConversationHistoryOptions {
  limit?: number
  offset?: number
  includeSystem?: boolean
}

// ==================== RAG TYPES ====================

export interface EmbeddingVector {
  values: number[]
  dimension: number
}

export interface ProductEmbeddingDoc {
  id: string
  product: string | Product
  embedding: number[]
  text: string
  locale: 'ar' | 'en'
  metadata?: {
    category?: string
    brand?: string
    price_range?: string
    [key: string]: any
  }
}

export interface VectorSearchOptions {
  query: string
  locale?: 'ar' | 'en'
  limit?: number
  similarityThreshold?: number
  filters?: {
    category?: string
    brand?: string
    priceRange?: {
      min?: number
      max?: number
    }
  }
}

export interface VectorSearchResult {
  product: Product
  similarity: number
  text: string
  metadata?: Record<string, any>
}

// ==================== CONTEXT RETRIEVAL TYPES ====================

export interface RetrievedContext {
  products: VectorSearchResult[]
  policies: any[]
  faqs: any[]
  relevanceScore: number
}

export interface ContextBuilderOptions {
  systemPrompt: string
  history: Message[]
  ragContext?: RetrievedContext
  userMessage: string
  maxTokens?: number
}

// ==================== GEMINI API TYPES ====================

export interface GeminiChatOptions {
  temperature?: number
  maxOutputTokens?: number
  topK?: number
  topP?: number
  stopSequences?: string[]
}

export interface GeminiStreamChunk {
  text?: string
  functionCalls?: FunctionCall[]
  finishReason?: 'stop' | 'max_tokens' | 'safety' | 'recitation' | 'other'
  metadata?: Record<string, any>
}

// ==================== KNOWLEDGE GRAPH TYPES ====================

export interface ProductNode {
  id: string
  product: Product
  category?: string
  brand?: string
}

export interface ProductRelationship {
  type: 'compatible_with' | 'alternative_to' | 'complementary_to' | 'belongs_to'
  from: string // product ID
  to: string // product ID or category ID
  weight?: number
  metadata?: Record<string, any>
}

export interface KnowledgeGraph {
  nodes: Map<string, ProductNode>
  edges: ProductRelationship[]
}

// ==================== RECOMMENDATION TYPES ====================

export interface RecommendationRequest {
  customerId?: string
  context?: string
  filters?: {
    category?: string
    priceRange?: { min?: number; max?: number }
  }
  limit?: number
}

export interface RecommendationResult {
  products: Product[]
  reasoning: string
  confidence: number
}

// ==================== COMPARISON TYPES ====================

export interface ComparisonRequest {
  productIds: string[]
  aspects?: string[] // specific aspects to compare
}

export interface ComparisonResult {
  products: Product[]
  comparisonTable: Record<string, any>[]
  summary: string
  recommendation?: string
}

// ==================== BUDGET PLANNING TYPES ====================

export interface BudgetPlanRequest {
  budget: number
  requirements: string
  customerId?: string
}

export interface BudgetPlanResult {
  solution: {
    products: Array<{
      product: Product
      quantity: number
      totalPrice: number
    }>
    totalCost: number
    remainingBudget: number
  }
  explanation: string
  alternatives?: BudgetPlanResult['solution'][]
}

// ==================== ERROR TYPES ====================

export class AIError extends Error {
  code: string
  details?: Record<string, any>

  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message)
    this.name = 'AIError'
    this.code = code
    this.details = details
  }
}

export class GeminiAPIError extends AIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'GEMINI_API_ERROR', details)
    this.name = 'GeminiAPIError'
  }
}

export class RAGError extends AIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'RAG_ERROR', details)
    this.name = 'RAGError'
  }
}

export class FunctionExecutionError extends AIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'FUNCTION_EXECUTION_ERROR', details)
    this.name = 'FunctionExecutionError'
  }
}

// ==================== CONFIGURATION TYPES ====================

export interface AIConfig {
  gemini: {
    apiKey: string
    model: string
    embeddingModel: string
    temperature: number
    maxTokens: number
  }
  rag: {
    retrievalLimit: number
    similarityThreshold: number
  }
  rateLimit: {
    perMinute: number
    perHour: number
  }
  cache: {
    ttl: number
  }
}

// ==================== CACHE TYPES ====================

export interface CacheEntry<T> {
  key: string
  value: T
  expiry: number
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds
}
