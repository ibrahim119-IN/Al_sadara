'use client'

import { useEffect } from 'react'
import { AlertOctagon, RefreshCw, Home } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error for monitoring
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)',
            fontFamily: 'Tajawal, Inter, system-ui, sans-serif',
          }}
        >
          <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
            {/* Error Icon */}
            <div
              style={{
                marginBottom: '2rem',
                display: 'inline-flex',
                padding: '1.5rem',
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #fee2e2',
              }}
            >
              <AlertOctagon
                style={{ width: '4rem', height: '4rem', color: '#dc2626' }}
                strokeWidth={1.5}
              />
            </div>

            {/* Error Message */}
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              خطأ حرج في النظام
            </h1>
            <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
              نعتذر عن هذا الخطأ غير المتوقع.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              A critical error occurred. Please try refreshing the page.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <button
                onClick={reset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#0066CC',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(0, 102, 204, 0.3)',
                }}
              >
                <RefreshCw style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>إعادة المحاولة</span>
              </button>

              <a
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#fff',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '1rem',
                }}
              >
                <Home style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>العودة للرئيسية</span>
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
