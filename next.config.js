/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Sentry plugin logic
let withSentry = (config) => config;
try {
  const { withSentryConfig } = require('@sentry/nextjs');
  withSentry = (config) => withSentryConfig(config, { silent: true });
} catch (e) {}

const nextConfig = {
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // REMOVA ou comente qualquer menção a styledComponents: true ou styledJsx: true aqui
  },
  

  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live", 
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", 
              "img-src 'self' data: blob: https:", 
              "font-src 'self' data: https://fonts.gstatic.com", 
              "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://*.sentry.io https://*.vercel.app", 
              "media-src 'self'", 
              "object-src 'none'", 
              "frame-src 'self'", 
              "base-uri 'self'", 
              "form-action 'self'", 
              "frame-ancestors 'none'", 
              "upgrade-insecure-requests", 
            ].join('; '),
          },
        ],
      },
      // ... (mantenha os headers de sw.js e manifest iguais)
    ];
  },
};

module.exports = withSentry(withBundleAnalyzer(nextConfig));
