/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Mantém static export
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  poweredByHeader: false,
  
  // IMPORTANTE: API Routes não funcionam com 'export'
  // Então vamos usar uma abordagem diferente
};

