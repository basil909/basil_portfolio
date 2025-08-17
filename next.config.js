const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization in development if not needed
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable optimizations for faster builds
    optimizeCss: true,
    
    // Reduce the size of the JavaScript bundles
    optimizePackageImports: ['framer-motion', 'react-intersection-observer'],
  },
  
  // Reduce bundle size by excluding certain packages from the server bundle
  transpilePackages: [],
};

module.exports = withBundleAnalyzer(nextConfig);