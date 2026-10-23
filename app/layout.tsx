import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Webnibo | Digital Marketplace & Templates',
  description: 'A curated marketplace for beautiful website templates, graphics, and digital tools.',
  icons: {
    icon: '/webnibo.png',
    shortcut: '/webnibo.png',
    apple: '/webnibo.png',
  },
  openGraph: {
    title: 'Webnibo | Digital Marketplace & Templates',
    description: 'Find the right starting point for your next digital project.',
    images: [{ url: '/webnibo.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-serif antialiased" style={{ fontFamily: '"Times New Roman", Times, Baskerville, Georgia, serif' }}>
        <AuthProvider>
          <div style={{ fontFamily: '"Times New Roman", Times, Baskerville, Georgia, serif' }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
