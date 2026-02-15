import './globals.css';
import { Poppins } from 'next/font/google';
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { Metadata, Viewport } from 'next';

import Providers from '@/components/shared/providers';
import LayoutWrapper from '@/components/shared/LayoutWrapper';
import { PWARegister } from '@/components/shared/PWARegister';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#267fc3' },
    { media: '(prefers-color-scheme: dark)', color: '#1a5a8a' },
  ],
};

export const metadata: Metadata = {
  title: 'Code and Smile | Digital Inclusion For All',
  description:
    'CAS Academy offers comprehensive courses in coding and digital literacy training. In memory of Bruce Tushabe.',
  icons: {
    icon: '/cas_favicon.svg',
    apple: '/cas_favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CAS Academy',
    startupImage: [
      {
        url: '/splash-icon.svg',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="flex min-h-screen flex-col overscroll-none">
        <Providers>
          <PWARegister />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
