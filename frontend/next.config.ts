import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  images: {
    domains: ['localhost', 'api.playnew.ai', 'playnew.ai'],
  },

  // Production optimizations
  swcMinify: true,
  compress: true,
};

export default nextConfig;
