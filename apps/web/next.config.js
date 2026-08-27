const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@autoesperto/types'],
  turbopack: {
    root: path.resolve(__dirname, '../..'),
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
