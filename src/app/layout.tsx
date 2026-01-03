import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'El Sayed Shehata Group - Plastic Raw Materials',
  description: 'El Sayed Shehata Group of Companies - Leaders in Plastic Raw Materials Trading and Polymers Supply',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
