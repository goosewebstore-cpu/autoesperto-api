/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@autoesperto/types'],
  turbopack: {
    root: require('path').resolve(__dirname, '../..'),
  },
};

module.exports = nextConfig;
