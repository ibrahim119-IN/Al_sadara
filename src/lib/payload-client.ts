import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { withTimeout, TIMEOUTS } from '@/lib/utils/timeout'

/**
 * Payload Client Singleton
 * Caches the Payload instance to avoid repeated initialization
 */

let cachedPayload: Payload | null = null
let initializationPromise: Promise<Payload> | null = null

/**
 * Get or create a cached Payload instance
 * Uses singleton pattern to avoid multiple getPayload() calls
 */
export async function getCachedPayload(): Promise<Payload> {
  // Return cached instance if available
  if (cachedPayload) {
    return cachedPayload
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise
  }

  // Start initialization
  initializationPromise = initializePayload()

  try {
    cachedPayload = await initializationPromise
    return cachedPayload
  } catch (error) {
    // Reset on error so next call can retry
    initializationPromise = null
    throw error
  }
}

/**
 * Initialize Payload with timeout and retry logic
 */
async function initializePayload(): Promise<Payload> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[PayloadClient] Initializing Payload (attempt ${attempt}/${maxRetries})...`)

      const payload = await withTimeout(
        getPayload({ config }),
        TIMEOUTS.DB_QUERY * 2, // Give more time for initial connection
        '[PayloadClient] getPayload initialization timed out'
      )

      console.log('[PayloadClient] Payload initialized successfully')
      return payload
    } catch (error: any) {
      lastError = error
      console.error(`[PayloadClient] Initialization attempt ${attempt} failed:`, error.message)

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.log(`[PayloadClient] Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('[PayloadClient] Failed to initialize Payload after all retries')
}

/**
 * Clear the cached Payload instance
 * Useful for testing or when connection needs to be reset
 */
export function clearPayloadCache(): void {
  cachedPayload = null
  initializationPromise = null
  console.log('[PayloadClient] Cache cleared')
}

/**
 * Check if Payload is currently cached
 */
export function isPayloadCached(): boolean {
  return cachedPayload !== null
}
