/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Disable caching in development
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
    // Disable static optimization in development
    staticPageGenerationTimeout: 0,
  }),
}

export default nextConfig
