import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Growth Tracker',
  description: 'Sistema de Crescimento Digital e Distinguido',
  manifest: '/manifest.json',
  themeColor: '#1a0f2e',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Growth Tracker',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a0f2e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Growth Tracker" />

        {/* Icons */}
        <link rel="icon" type="image/png" sizes="32x32"   href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16"   href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon"      sizes="180x180" href="/icons/apple-touch-icon.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#1a0f2e" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
