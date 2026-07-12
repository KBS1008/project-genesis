import type { NextConfig } from 'next';

const apiOrigin = process.env.API_ORIGIN ?? 'http://127.0.0.1:3001';

const nextConfig: NextConfig = {
  experimental: {
    // Avoids SegmentViewNode manifest corruption on Windows dev (Next.js 15.5+).
    devtoolSegmentExplorer: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
