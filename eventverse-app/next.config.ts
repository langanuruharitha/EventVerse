import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    // Empty turbopack config to silence webpack warning
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
      {
        protocol: 'https',
        hostname: 'pollinations.ai',
      },
    ],
  },
};

export default nextConfig;
