/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/alerts', destination: '/dashboard', permanent: true },
      { source: '/change-impact', destination: '/dashboard', permanent: true },
      { source: '/clusters', destination: '/dashboard', permanent: true },
      { source: '/deployments', destination: '/dashboard', permanent: true },
      { source: '/health', destination: '/dashboard', permanent: true },
      { source: '/pipelines', destination: '/dashboard', permanent: true },
      { source: '/recommendations', destination: '/dashboard', permanent: true },
      { source: '/releases', destination: '/dashboard', permanent: true },
      { source: '/repositories', destination: '/dashboard', permanent: true },
      { source: '/risk-analysis', destination: '/dashboard', permanent: true },
      { source: '/rules', destination: '/dashboard', permanent: true },
      { source: '/teams', destination: '/dashboard', permanent: true },
      { source: '/workflows', destination: '/dashboard', permanent: true },
    ]
  },
}

export default nextConfig
