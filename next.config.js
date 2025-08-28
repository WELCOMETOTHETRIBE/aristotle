/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Allow build to succeed even without environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
}

module.exports = nextConfig 