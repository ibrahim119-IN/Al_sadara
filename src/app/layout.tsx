import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Al Sadara - Smart Building Solutions',
  description: 'Al Sadara for Electronics and Building Management Systems - CCTV, Access Control, PBX, and more',
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
