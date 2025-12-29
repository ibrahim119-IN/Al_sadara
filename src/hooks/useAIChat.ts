import { useAIAssistant } from '@/contexts/AIAssistantContext'

/**
 * Hook for AI Chat functionality
 * Re-exports AI Assistant context for clean imports
 */
export function useAIChat() {
  return useAIAssistant()
}

export default useAIChat
