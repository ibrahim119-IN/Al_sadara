'use client'

import { AIAssistantProvider } from '@/contexts/AIAssistantContext'

/**
 * AI Assistant Provider Wrapper
 * Client component wrapper for AIAssistantContext
 */
export function AIAssistantProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AIAssistantProvider>{children}</AIAssistantProvider>
}
