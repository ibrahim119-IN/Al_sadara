// Al Sadara PWA Service Worker

const CACHE_NAME = 'alsadara-v1'
const OFFLINE_URL = '/offline'

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/ar',
  '/en',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// API routes to cache with network-first strategy
const API_ROUTES = [
  '/api/products',
  '/api/categories',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err)
      })
    })
  )

  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )

  // Take control of all clients immediately
  self.clients.claim()
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return
  }

  // Skip admin routes
  if (url.pathname.startsWith('/admin')) {
    return
  }

  // Skip POST, PUT, DELETE requests
  if (request.method !== 'GET') {
    return
  }

  // API requests - Network first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets - Cache first, fall back to network
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Pages - Stale while revalidate
  event.respondWith(staleWhileRevalidate(request))
})

// Check if the request is for a static asset
function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/fonts/') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  )
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('[SW] Cache first failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone())
        })
      }
      return networkResponse
    })
    .catch(async () => {
      // If we have a cached response, that's already being returned
      // Otherwise, return offline page
      if (!cachedResponse) {
        const offlineResponse = await caches.match(OFFLINE_URL)
        return offlineResponse || new Response('Offline', { status: 503 })
      }
      return cachedResponse
    })

  return cachedResponse || fetchPromise
}

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      body: data.body || 'You have a new notification',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
      },
      actions: data.actions || [
        { action: 'open', title: 'فتح' },
        { action: 'close', title: 'إغلاق' },
      ],
      dir: 'rtl',
      lang: 'ar',
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'Al Sadara', options)
    )
  } catch (error) {
    console.error('[SW] Push notification error:', error)
  }
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)

  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart())
  }

  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders())
  }
})

// Sync cart data
async function syncCart() {
  try {
    // Get pending cart updates from IndexedDB
    // This would be implemented based on your cart storage strategy
    console.log('[SW] Syncing cart...')
  } catch (error) {
    console.error('[SW] Cart sync failed:', error)
  }
}

// Sync orders
async function syncOrders() {
  try {
    console.log('[SW] Syncing orders...')
  } catch (error) {
    console.error('[SW] Orders sync failed:', error)
  }
}

console.log('[SW] Service worker loaded')
