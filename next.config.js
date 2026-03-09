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

  // Security headers - CORRIGIDOS PARA NEXT.JS + PWA
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          
          // CSP CORRIGIDO - Permite Next.js, PWA e Google Fonts
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js precisa de unsafe-eval e unsafe-inline
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Estilos inline + Google Fonts
              "img-src 'self' data: blob: https:", // Imagens locais, data URIs, blobs e https
              "font-src 'self' data: https://fonts.gstatic.com", // Fontes locais e Google Fonts
              "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com", // APIs e fontes
              "media-src 'self'", // Áudio/vídeo
              "object-src 'none'", // Sem plugins
              "frame-src 'self'", // iframes só do mesmo domínio
              "base-uri 'self'", // Base URL
              "form-action 'self'", // Forms só para mesmo domínio
              "frame-ancestors 'none'", // Não pode ser iframe
              "upgrade-insecure-requests", // HTTPS automático
            ].join('; '),
          },
        ],
      },
      
      // Headers específicos para Service Worker
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      
      // Headers específicos para manifest
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      
      // Headers para ícones PWA
      {
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = withSentry(withBundleAnalyzer(nextConfig));