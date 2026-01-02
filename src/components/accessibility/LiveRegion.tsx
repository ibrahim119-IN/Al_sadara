'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

type LiveRegionPoliteness = 'polite' | 'assertive'

interface Announcement {
  message: string
  politeness: LiveRegionPoliteness
  id: string
}

interface LiveRegionContextValue {
  announce: (message: string, politeness?: LiveRegionPoliteness) => void
  announcePolite: (message: string) => void
  announceAssertive: (message: string) => void
}

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null)

export function useLiveRegion() {
  const context = useContext(LiveRegionContext)
  if (!context) {
    throw new Error('useLiveRegion must be used within LiveRegionProvider')
  }
  return context
}

interface LiveRegionProviderProps {
  children: React.ReactNode
  clearDelay?: number
}

export function LiveRegionProvider({ children, clearDelay = 5000 }: LiveRegionProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('')
  const [assertiveMessage, setAssertiveMessage] = useState('')
  const politeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const assertiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const announce = useCallback((message: string, politeness: LiveRegionPoliteness = 'polite') => {
    if (politeness === 'assertive') {
      if (assertiveTimeoutRef.current) {
        clearTimeout(assertiveTimeoutRef.current)
      }
      setAssertiveMessage(message)
      assertiveTimeoutRef.current = setTimeout(() => setAssertiveMessage(''), clearDelay)
    } else {
      if (politeTimeoutRef.current) {
        clearTimeout(politeTimeoutRef.current)
      }
      setPoliteMessage(message)
      politeTimeoutRef.current = setTimeout(() => setPoliteMessage(''), clearDelay)
    }
  }, [clearDelay])

  const announcePolite = useCallback((message: string) => {
    announce(message, 'polite')
  }, [announce])

  const announceAssertive = useCallback((message: string) => {
    announce(message, 'assertive')
  }, [announce])

  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current)
      if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current)
    }
  }, [])

  return (
    <LiveRegionContext.Provider value={{ announce, announcePolite, announceAssertive }}>
      {children}

      {/* Polite live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>

      {/* Assertive live region */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveRegionContext.Provider>
  )
}

// Utility component for inline announcements
interface AnnouncerProps {
  message: string
  politeness?: LiveRegionPoliteness
}

export function Announcer({ message, politeness = 'polite' }: AnnouncerProps) {
  return (
    <div
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
