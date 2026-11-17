const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Always defined, so it is inlined as a constant and the dev-only perf panel
  // (ErrorBoundary.tsx) is dropped from production bundles unless it is '1'.
  env: {
    NEXT_PUBLIC_PERF_MONITOR: process.env.NEXT_PUBLIC_PERF_MONITOR ?? '',
  },

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
  },

  async headers() {
    return [
      {
        // Downloadable, but kept out of search results (it contains contact details).
        // `\\.` so the regex gets a literal dot (a lone `\.` in a JS string is just `.`).
        source: '/:file(.*\\.pdf)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
