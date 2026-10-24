import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://webnibo.example.com'),
  title: 'Webnibo | Premium Website Templates & Digital Marketplace',
  description: 'A curated marketplace for premium website templates, UI kits, and digital products. Find the perfect starting point for your next project.',
  icons: {
    icon: '/webnibo.png',
    shortcut: '/webnibo.png',
    apple: '/webnibo.png',
  },
  openGraph: {
    title: 'Webnibo | Premium Website Templates & Digital Marketplace',
    description: 'Find the right starting point for your next digital project.',
    images: [{ url: '/webnibo.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
