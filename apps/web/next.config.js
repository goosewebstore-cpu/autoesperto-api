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
        source: '/:path*',
        has: [{ type: 'host', value: 'www.autoesperto.it' }],
        destination: 'https://autoesperto.it/:path*',
        permanent: true,
      },
      {
        source: '/guide/autoesperto-cerca-investitori-ai-auto-usate',
        destination: '/guide/autoesperto-cerca-investitori-sistema-proprietario',
        permanent: true,
      },
      {
        source: '/guide/dashcam-24-ore-parking-mode-proteggere-auto-parcheggiata',
        destination: '/guide/dashcam-autoesperto-proteggi-auto-anche-quando-non-ci-sei',
        permanent: true,
      },
      {
        source: '/og/:path*',
        destination: '/og-image.png',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
