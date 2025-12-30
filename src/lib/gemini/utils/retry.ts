/**
 * Retry Utility with Exponential Backoff
 * For handling transient failures in API calls
 */

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  shouldRetry?: (error: unknown) => boolean
  onRetry?: (attempt: number, error: unknown) => void
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> & { onRetry?: RetryOptions['onRetry'] } = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  shouldRetry: (error: unknown) => {
    // Retry on network errors and rate limits
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return (
        message.includes('rate limit') ||
        message.includes('timeout') ||
        message.includes('network') ||
        message.includes('503') ||
        message.includes('429') ||
        message.includes('overloaded')
      )
    }
    return false
  },
}

/**
 * Execute a function with retry logic and exponential backoff
 * @param fn - The async function to execute
 * @param options - Retry options
 * @returns The result of the function
 * @throws The last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: unknown

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Check if we should retry
      if (attempt >= opts.maxRetries || !opts.shouldRetry(error)) {
        throw error
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        opts.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        opts.maxDelay
      )

      // Notify about retry
      if (opts.onRetry) {
        opts.onRetry(attempt + 1, error)
      }

      console.log(`[Retry] Attempt ${attempt + 1}/${opts.maxRetries} failed, retrying in ${Math.round(delay)}ms...`)

      // Wait before retrying
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Create a retry-wrapped version of an async function
 */
export function withRetryWrapper<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    return withRetry(() => fn(...args), options)
  }) as T
}

/**
 * Predefined retry strategies
 */
export const RetryStrategies = {
  // Aggressive retry for critical operations
  aggressive: {
    maxRetries: 5,
    baseDelay: 500,
    maxDelay: 15000,
  } as RetryOptions,

  // Conservative retry for non-critical operations
  conservative: {
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 5000,
  } as RetryOptions,

  // Fast retry for quick operations
  fast: {
    maxRetries: 3,
    baseDelay: 200,
    maxDelay: 2000,
  } as RetryOptions,
}
