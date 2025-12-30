/**
 * Client-Safe Gemini Exports
 *
 * This file exports only the code that can be used in client components.
 * It does NOT include server-side code:
 * - embeddings.ts (uses Payload)
 * - functions/executor.ts (uses Payload)
 * - chat.ts (uses functions/executor)
 * - live/session.ts (uses functions/executor)
 * - client.ts (uses process.env which causes issues in some bundlers)
 *
 * For server-side code, use '@/lib/gemini' directly in API routes.
 */

// Types (all safe - no runtime imports)
export * from './types'

// Function declarations (safe - just type definitions)
export {
  shoppingFunctions,
  getFunctionDeclarations,
  getFunctionByName,
  validateFunctionArgs,
} from './functions/definitions'

// Live API - Client Safe Version (does NOT auto-execute functions)
export {
  createLiveSessionClient as createLiveSession,
  VOICE_OPTIONS,
  isLiveApiSupported,
  getMicrophonePermission,
  requestMicrophoneAccess,
} from './live/session-client'

// Audio processing (safe - browser APIs only)
export {
  AudioProcessor,
  AudioPlayer,
  createAudioHandlers,
} from './live/audio-processor'

// Grounding utilities (safe - pure functions)
export {
  formatGroundingMetadata,
  GROUNDING_CONFIGS,
  shouldUseGrounding,
  highlightGroundedContent,
  generateCitations,
} from './tools/grounding'
