/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the site deploys to any static host (Netlify, Vercel, cPanel, S3…).
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
