import type { Metadata } from 'next';
import { Manrope, Poppins } from 'next/font/google';
import { Providers } from '@/providers';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'OVU Admin Portal',
  description: 'Internal admin portal for OVU staff to manage users, partners, bookings, transactions, and analytics',
  keywords: ['OVU', 'Admin', 'Management', 'Transport', 'Analytics'],
  authors: [{ name: 'OVU Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B5B7A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
