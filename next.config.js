/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Sentry plugin will wrap the config if SENTRY_DSN is set
let withSentry = (config) => config;
try {
  const { withSentryConfig } = require('@sentry/nextjs');
  withSentry = withSentryConfig;
} catch (e) {
  // if @sentry/nextjs is not installed the require will fail; ignore for now
}

const nextConfig = {
  // output: 'export', // Removido para permitir API routes
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  poweredByHeader: false,

  // Security headers added for better protection
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          // content-security-policy should be specific to your app; tweak as needed
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
          },
        ],
      },
    ];
  },
  
  // IMPORTANTE: API Routes não funcionam com 'export'
  // Então vamos usar uma abordagem diferente
};

module.exports = withSentry(withBundleAnalyzer(nextConfig));

