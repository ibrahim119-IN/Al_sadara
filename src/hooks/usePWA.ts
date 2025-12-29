'use client'

import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isUpdateAvailable: false,
  })
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Register service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        setRegistration(reg)
        console.log('[PWA] Service worker registered')

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState((prev) => ({ ...prev, isUpdateAvailable: true }))
                console.log('[PWA] New version available')
              }
            })
          }
        })
      } catch (error) {
        console.error('[PWA] Service worker registration failed:', error)
      }
    }

    registerSW()
  }, [])

  // Handle install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setState((prev) => ({ ...prev, isInstallable: true }))
      console.log('[PWA] Install prompt available')
    }

    const handleAppInstalled = () => {
      setState((prev) => ({ ...prev, isInstalled: true, isInstallable: false }))
      setDeferredPrompt(null)
      console.log('[PWA] App installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setState((prev) => ({ ...prev, isInstalled: true }))
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Handle online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }))
    }

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Install the app
  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available')
      return false
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt')
        return true
      } else {
        console.log('[PWA] User dismissed the install prompt')
        return false
      }
    } catch (error) {
      console.error('[PWA] Install failed:', error)
      return false
    } finally {
      setDeferredPrompt(null)
      setState((prev) => ({ ...prev, isInstallable: false }))
    }
  }, [deferredPrompt])

  // Update the app
  const update = useCallback(async () => {
    if (!registration) return

    try {
      await registration.update()

      // Skip waiting and reload
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    } catch (error) {
      console.error('[PWA] Update failed:', error)
    }
  }, [registration])

  // Request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported')
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    console.log('[PWA] Notification permission:', permission)
    return permission
  }, [])

  return {
    ...state,
    install,
    update,
    requestNotificationPermission,
    registration,
  }
}
