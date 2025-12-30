/**
 * Gemini Chat Service
 * Streaming chat with Function Calling and Grounding
 */
import { getGeminiClient, MODELS, CONFIG, SYSTEM_PROMPTS } from './client'
import { FunctionCallingConfigMode, type GenerateContentConfig } from '@google/genai'
import {
  ChatMessage,
  ChatOptions,
  ChatResponse,
  StreamChunk,
  GeminiContent,
  FunctionCall,
  GeminiError,
  GeminiErrorCodes,
} from './types'
import { getFunctionDeclarations } from './functions/definitions'
import { executeFunction, executeFunctions } from './functions/executor'
import { withRetry, RetryStrategies } from './utils/retry'
import { getUserFriendlyError, getNoResultsMessage } from './utils/errors'

/**
 * Convert our ChatMessage format to Gemini Content format
 */
function toGeminiContent(messages: ChatMessage[]): GeminiContent[] {
  return messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }))
}

/**
 * Generate a single chat response (non-streaming)
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResponse> {
  const {
    systemPrompt = SYSTEM_PROMPTS.SHOPPING_ASSISTANT,
    enableFunctions = true,
    enableGrounding = CONFIG.ENABLE_GOOGLE_GROUNDING,
    temperature = CONFIG.TEMPERATURE,
    maxTokens = CONFIG.MAX_TOKENS,
  } = options

  try {
    const ai = getGeminiClient()

    // Build tools array
    const tools: unknown[] = []

    if (enableFunctions) {
      const declarations = getFunctionDeclarations()
      console.log('[Chat] Functions enabled, declarations count:', declarations.length)
      tools.push({ functionDeclarations: declarations })
    }

    if (enableGrounding) {
      tools.push({ googleSearch: {} })
    }

    const config: GenerateContentConfig = {
      systemInstruction: systemPrompt,
      temperature,
      maxOutputTokens: maxTokens,
    }

    if (tools.length > 0) {
      config.tools = tools as GenerateContentConfig['tools']
      // Force function calling mode
      config.toolConfig = {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY, // Force the model to always call a function
        },
      }
    }

    console.log('[Chat] Using model:', MODELS.CHAT)
    console.log('[Chat] Tools count:', tools.length)
    console.log('[Chat] Message:', messages[messages.length - 1]?.content?.substring(0, 100))

    // Use retry logic for API calls
    const response = await withRetry(
      () => ai.models.generateContent({
        model: MODELS.CHAT,
        contents: toGeminiContent(messages),
        config,
      }),
      {
        ...RetryStrategies.conservative,
        onRetry: (attempt, error) => {
          console.log(`[Chat] Retry attempt ${attempt}:`, error)
        },
      }
    )

    console.log('[Chat] Response received')
    console.log('[Chat] Function calls from response:', response.functionCalls)
    console.log('[Chat] Response text preview:', response.text?.substring(0, 100))

    // Handle function calls
    const functionCalls = response.functionCalls as FunctionCall[] | undefined
    if (functionCalls && functionCalls.length > 0) {
      console.log('[Chat] Executing function calls:', functionCalls.map(fc => fc.name))
      // Execute functions
      const functionResponses = await executeFunctions(functionCalls)
      console.log('[Chat] Function results:', JSON.stringify(functionResponses, null, 2).substring(0, 500))

      // Format function results as a clear message for the model
      const functionResultsText = functionResponses.map(fr => {
        const result = fr.response as Record<string, unknown>
        if (result.products && Array.isArray(result.products)) {
          const products = result.products as Array<Record<string, unknown>>
          if (products.length === 0) {
            return `البحث عن "${(functionCalls.find(fc => fc.name === fr.name)?.args as Record<string, unknown>)?.query || ''}" لم يجد نتائج.`
          }
          return `نتائج البحث (${products.length} منتج):\n${products.map((p, i) =>
            `${i + 1}. ${p.name} - السعر: ${p.price} جنيه${p.inStock ? ' (متوفر)' : ' (غير متوفر)'}`
          ).join('\n')}`
        }
        return JSON.stringify(result)
      }).join('\n\n')

      // Generate follow-up response with clear context
      const updatedMessages: ChatMessage[] = [
        ...messages,
        { role: 'model', content: 'سأبحث لك عن المنتجات المطلوبة...' },
        { role: 'user', content: `هذه نتائج البحث من قاعدة البيانات:\n\n${functionResultsText}\n\nاعرض هذه المنتجات للعميل بشكل مفيد ومنظم.` },
      ]

      const followUpResponse = await withRetry(
        () => ai.models.generateContent({
          model: MODELS.CHAT,
          contents: toGeminiContent(updatedMessages),
          config: {
            systemInstruction: systemPrompt,
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
        RetryStrategies.conservative
      )

      return {
        text: followUpResponse.text || '',
        functionCalls,
        usage: {
          promptTokens: 0, // SDK doesn't expose this directly
          completionTokens: 0,
          totalTokens: 0,
        },
      }
    }

    return {
      text: response.text || '',
      groundingMetadata: response.candidates?.[0]?.groundingMetadata as unknown as ChatResponse['groundingMetadata'],
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    }
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Stream chat response (generator function)
 */
export async function* streamChatResponse(
  messages: ChatMessage[],
  options: ChatOptions = {}
): AsyncGenerator<StreamChunk> {
  const {
    systemPrompt = SYSTEM_PROMPTS.SHOPPING_ASSISTANT,
    enableFunctions = true,
    enableGrounding = CONFIG.ENABLE_GOOGLE_GROUNDING,
    temperature = CONFIG.TEMPERATURE,
    maxTokens = CONFIG.MAX_TOKENS,
  } = options

  try {
    const ai = getGeminiClient()

    // Build tools array
    const tools: unknown[] = []

    if (enableFunctions) {
      tools.push({ functionDeclarations: getFunctionDeclarations() })
    }

    if (enableGrounding) {
      tools.push({ googleSearch: {} })
    }

    const streamConfig: GenerateContentConfig = {
      systemInstruction: systemPrompt,
      temperature,
      maxOutputTokens: maxTokens,
    }

    if (tools.length > 0) {
      streamConfig.tools = tools as GenerateContentConfig['tools']
      // Force function calling mode (same as non-streaming)
      streamConfig.toolConfig = {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
        },
      }
    }

    console.log('[streamChatResponse] Starting with tools:', tools.length)

    const response = await ai.models.generateContentStream({
      model: MODELS.CHAT,
      contents: toGeminiContent(messages),
      config: streamConfig,
    })

    let accumulatedFunctionCalls: FunctionCall[] = []

    for await (const chunk of response) {
      // Check for function calls - accumulate but DON'T yield to client
      // The client should only see the final text response after function execution
      if (chunk.functionCalls) {
        accumulatedFunctionCalls.push(...(chunk.functionCalls as FunctionCall[]))
        console.log('[streamChatResponse] Function call received:', (chunk.functionCalls as FunctionCall[]).map(fc => fc.name))
      }

      // Check for text - only yield if no function calls (otherwise wait for follow-up)
      if (chunk.text && accumulatedFunctionCalls.length === 0) {
        yield { type: 'text', data: chunk.text }
      }
    }

    // If we have function calls, execute them and stream follow-up
    if (accumulatedFunctionCalls.length > 0) {
      console.log('[streamChatResponse] Executing functions:', accumulatedFunctionCalls.map(fc => fc.name))

      // Execute all accumulated function calls
      const functionResponses = await executeFunctions(accumulatedFunctionCalls)
      console.log('[streamChatResponse] Function responses received:', functionResponses.length)
      console.log('[streamChatResponse] Function results:', JSON.stringify(functionResponses, null, 2).substring(0, 500))

      // Format function results as a clear message for the model
      // This helps the model understand what products were found and how to present them
      const functionResultsText = functionResponses.map(fr => {
        const result = fr.response as Record<string, unknown>
        if (result.products && Array.isArray(result.products)) {
          const products = result.products as Array<Record<string, unknown>>
          if (products.length === 0) {
            return `البحث عن "${(accumulatedFunctionCalls.find(fc => fc.name === fr.name)?.args as Record<string, unknown>)?.query || ''}" لم يجد نتائج.`
          }
          return `نتائج البحث (${products.length} منتج):\n${products.map((p, i) =>
            `${i + 1}. ${p.name} - السعر: ${p.price} جنيه${p.inStock ? ' (متوفر)' : ' (غير متوفر)'}`
          ).join('\n')}`
        }
        return JSON.stringify(result)
      }).join('\n\n')

      // Generate follow-up response with clear context
      const updatedMessages: ChatMessage[] = [
        ...messages,
        { role: 'model', content: 'سأبحث لك عن المنتجات المطلوبة...' },
        { role: 'user', content: `هذه نتائج البحث من قاعدة البيانات:\n\n${functionResultsText}\n\nاعرض هذه المنتجات للعميل بشكل مفيد ومنظم.` },
      ]

      console.log('[streamChatResponse] Generating follow-up response...')

      const followUpResponse = await ai.models.generateContentStream({
        model: MODELS.CHAT,
        contents: toGeminiContent(updatedMessages),
        config: {
          systemInstruction: systemPrompt,
          temperature,
          maxOutputTokens: maxTokens,
        },
      })

      for await (const chunk of followUpResponse) {
        if (chunk.text) {
          console.log('[streamChatResponse] Follow-up text chunk:', chunk.text.substring(0, 50))
          yield { type: 'text', data: chunk.text }
        }
      }

      console.log('[streamChatResponse] Follow-up complete')
    }
  } catch (error) {
    console.error('[streamChatResponse] Error:', error)
    yield { type: 'error', data: handleError(error) }
  }
}

/**
 * Create a chat session for multi-turn conversations
 */
export function createChatSession(options: ChatOptions = {}) {
  const messages: ChatMessage[] = []
  const {
    systemPrompt = SYSTEM_PROMPTS.SHOPPING_ASSISTANT,
    enableFunctions = true,
    enableGrounding = CONFIG.ENABLE_GOOGLE_GROUNDING,
  } = options

  return {
    /**
     * Send a message and get a response
     */
    async sendMessage(userMessage: string): Promise<ChatResponse> {
      messages.push({ role: 'user', content: userMessage })

      const response = await generateChatResponse(messages, {
        systemPrompt,
        enableFunctions,
        enableGrounding,
      })

      messages.push({ role: 'model', content: response.text })

      return response
    },

    /**
     * Send a message and stream the response
     */
    async *sendMessageStream(userMessage: string): AsyncGenerator<StreamChunk> {
      messages.push({ role: 'user', content: userMessage })

      let fullResponse = ''

      for await (const chunk of streamChatResponse(messages, {
        systemPrompt,
        enableFunctions,
        enableGrounding,
      })) {
        if (chunk.type === 'text') {
          fullResponse += chunk.data
        }
        yield chunk
      }

      messages.push({ role: 'model', content: fullResponse })
    },

    /**
     * Get conversation history
     */
    getHistory(): ChatMessage[] {
      return [...messages]
    },

    /**
     * Clear conversation history
     */
    clearHistory(): void {
      messages.length = 0
    },

    /**
     * Add a message to history without generating a response
     */
    addMessage(message: ChatMessage): void {
      messages.push(message)
    },
  }
}

/**
 * Quick chat - single turn without session
 */
export async function quickChat(
  userMessage: string,
  options: ChatOptions = {}
): Promise<string> {
  const response = await generateChatResponse(
    [{ role: 'user', content: userMessage }],
    options
  )
  return response.text
}

/**
 * Handle and transform errors with user-friendly messages
 */
function handleError(error: unknown): GeminiError {
  if (error instanceof GeminiError) {
    return error
  }

  const err = error as Error & { status?: number; code?: string }

  // Get user-friendly message
  const userMessage = getUserFriendlyError(error)

  // Check for specific error types for proper error codes
  if (err.message?.includes('API key') || err.status === 401) {
    return new GeminiError(
      userMessage,
      GeminiErrorCodes.API_KEY_MISSING,
      401,
      false // Don't retry auth errors
    )
  }

  if (err.status === 429 || err.message?.includes('rate limit')) {
    return new GeminiError(
      userMessage,
      GeminiErrorCodes.RATE_LIMITED,
      429,
      true
    )
  }

  if (err.status === 503 || err.message?.includes('overloaded')) {
    return new GeminiError(
      userMessage,
      GeminiErrorCodes.RATE_LIMITED,
      503,
      true
    )
  }

  if (err.message?.includes('timeout') || err.message?.includes('network')) {
    return new GeminiError(
      userMessage,
      GeminiErrorCodes.NETWORK_ERROR,
      500,
      true
    )
  }

  return new GeminiError(
    userMessage,
    GeminiErrorCodes.NETWORK_ERROR,
    500,
    true
  )
}
