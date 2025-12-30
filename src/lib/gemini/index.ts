/**
 * Gemini AI Module - Main Entry Point
 *
 * This module provides a complete AI integration for the Al Sadara e-commerce platform
 * using Google's Gemini SDK.
 *
 * Features:
 * - Chat with streaming and function calling
 * - Voice/audio conversations via Live API
 * - Semantic search with embeddings
 * - Google Search grounding for reduced hallucinations
 */

// Client and configuration
export {
  getGeminiClient,
  MODELS,
  CONFIG,
  SYSTEM_PROMPTS,
  resetClient,
  isGeminiConfigured,
} from './client'

// Types
export * from './types'

// Chat service
export {
  generateChatResponse,
  streamChatResponse,
  createChatSession,
  quickChat,
} from './chat'

// Embeddings
export {
  generateEmbedding,
  generateBatchEmbeddings,
  cosineSimilarity,
  findSimilarByEmbedding,
  indexProduct,
  semanticSearch,
  batchIndexProducts,
} from './embeddings'

// Function calling
export {
  shoppingFunctions,
  getFunctionDeclarations,
  getFunctionByName,
  validateFunctionArgs,
} from './functions/definitions'

export {
  executeFunction,
  executeFunctions,
} from './functions/executor'

// Live API (Voice)
export {
  createLiveSession,
  VOICE_OPTIONS,
  isLiveApiSupported,
  getMicrophonePermission,
  requestMicrophoneAccess,
} from './live/session'

export {
  AudioProcessor,
  AudioPlayer,
  createAudioHandlers,
} from './live/audio-processor'

// Grounding
export {
  formatGroundingMetadata,
  GROUNDING_CONFIGS,
  shouldUseGrounding,
  highlightGroundedContent,
  generateCitations,
} from './tools/grounding'
