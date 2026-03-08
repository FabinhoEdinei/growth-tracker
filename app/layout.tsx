import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Growth Tracker',
  description: 'Sistema de Crescimento Digital e Distinguido',
  manifest: '/manifest.json',                    // ← NOVO
  themeColor: '#00ff88',                         // ← NOVO
  viewport: {                                     // ← NOVO
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {                                  // ← NOVO
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Growth Tracker',
  },
  icons: {                                        // ← NOVO
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
        
        {/* PWA Meta Tags - NOVO */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff88" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Growth Tracker" />
        
        {/* Icons - NOVO */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Microsoft Tiles - NOVO */}
        <meta name="msapplication-TileColor" content="#0f0a1e" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}