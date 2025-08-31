/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL || '',
  },
  // Type checking and linting
  typescript: {
    ignoreBuildErrors: true, // Disable type checking for deployment
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Content Security Policy - adjust based on your needs
          { 
            key: "Content-Security-Policy", 
            value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; font-src 'self' data:;" 
          },
        ],
      },
    ];
  },
  // Image optimization
  images: {
    unoptimized: false, // Enable image optimization
    domains: ['picsum.photos'], // Add domains for external images
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Asset prefix for production
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig 