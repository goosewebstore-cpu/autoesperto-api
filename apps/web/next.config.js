const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@autoesperto/types'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'jspdf'],
  },
  productionBrowserSourceMaps: false,
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/og/:path*',
        destination: '/og-image.png',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
