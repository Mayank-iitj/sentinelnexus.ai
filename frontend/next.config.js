/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // Image optimization for Vercel
  images: {
    domains: ['aishield.io', 'api.aishield.io'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Vercel deployment optimizations
  poweredByHeader: false,
  compress: true,
  
  // Handle trailing slashes consistently
  trailingSlash: false,
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Rewrites for API proxy (development)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/v1/:path*',
            destination: `${apiUrl}/api/v1/:path*`,
          },
        ]
      : [];
  },
}

module.exports = nextConfig
