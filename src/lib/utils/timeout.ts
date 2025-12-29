/**
 * Timeout Utility Functions
 * Provides timeout wrappers for async operations to prevent indefinite hangs
 */

/**
 * Wraps a promise with a timeout
 * If the promise doesn't resolve within the timeout, it rejects with an error
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${errorMessage} (after ${timeoutMs}ms)`))
    }, timeoutMs)
  })

  try {
    const result = await Promise.race([promise, timeoutPromise])
    clearTimeout(timeoutId!)
    return result
  } catch (error) {
    clearTimeout(timeoutId!)
    throw error
  }
}

/**
 * Wraps a promise with a timeout, returning a default value instead of throwing
 */
export async function withTimeoutFallback<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue: T,
  onTimeout?: (error: Error) => void
): Promise<T> {
  try {
    return await withTimeout(promise, timeoutMs, 'Operation timed out')
  } catch (error) {
    if (error instanceof Error && error.message.includes('timed out')) {
      onTimeout?.(error)
      return fallbackValue
    }
    throw error
  }
}

/**
 * Configuration for different operation timeouts
 */
export const TIMEOUTS = {
  // Database operations
  DB_QUERY: 10000,      // 10 seconds
  DB_CREATE: 10000,     // 10 seconds
  DB_UPDATE: 10000,     // 10 seconds

  // AI operations
  EMBEDDING: 15000,     // 15 seconds
  VECTOR_SEARCH: 15000, // 15 seconds
  KNOWLEDGE_SEARCH: 10000, // 10 seconds

  // Gemini API
  GEMINI_CHAT: 30000,   // 30 seconds

  // Overall API request
  API_OVERALL: 45000,   // 45 seconds

  // RAG operations (combined)
  RAG_TOTAL: 20000,     // 20 seconds for all RAG
} as const
