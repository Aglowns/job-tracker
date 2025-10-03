/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@job-tracker/shared'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  eslint: {
    // Skip ESLint during builds for faster deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript checking is still enabled
    ignoreBuildErrors: false,
  }
}

module.exports = nextConfig

