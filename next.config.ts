import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // To generate static pages on build
  output: 'export',

  // Paths for when Hosting
  // basePath: '/bechamel',
  // assetPrefix: '/bechamel',

  experimental: {
    // Tree-shaking for Mantine
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default nextConfig;
