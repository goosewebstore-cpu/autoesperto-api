import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorker from '@/components/ServiceWorker';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'AutoEsperto — L\'esperto che controlla l\'auto prima di comprarla',
  description: 'Consulente AI italiano per acquistare auto usate in modo sicuro e intelligente. Analisi affidabilità, prezzo di mercato, problemi noti e report PDF.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AutoEsperto',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#2563EB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <ServiceWorker />
          {children}
          <div id="modal-root" />
        </AuthProvider>
      </body>
    </html>
  );
}
