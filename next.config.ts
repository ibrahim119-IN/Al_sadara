import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Your Next.js config here
  output: 'standalone', // Required for Docker deployment
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      // Unsplash - for product images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Local uploads
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Al Sadara CDN (production)
      {
        protocol: 'https',
        hostname: '*.alsadara.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.alsadara.org',
      },
      // Payload CMS uploads
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Optimize images
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
}

export default withPayload(nextConfig)
