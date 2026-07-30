/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },

  // ── Production Security Headers (Security Audit P1-H2/H3) ──────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — disallow embedding in iframes from other origins
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control how much referrer information is sent
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features not needed by NexOps
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Enforce HTTPS for 1 year (only safe once fully on HTTPS)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Content Security Policy — restricts script, style, image, and connect sources
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + Google APIs (Firebase Auth)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
              // Styles: self + inline (Tailwind generates inline styles)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + data URIs + Google avatars + ui-avatars CDN
              "img-src 'self' data: blob: https://lh3.googleusercontent.com https://ui-avatars.com",
              // API connections: self + backend Render URL + Firebase + Google APIs
              "connect-src 'self' https://nexopsbackend.onrender.com https://*.googleapis.com https://*.firebaseio.com wss://nexopsbackend.onrender.com",
              // Frames: Google auth popup
              "frame-src https://accounts.google.com",
              // No plugins
              "object-src 'none'",
              // Base URI restricted to self
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ]
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
