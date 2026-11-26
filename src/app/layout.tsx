import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Prism: Interview — Practice the exact interview you are about to face',
    template: '%s | Prism: Interview',
  },
  description:
    'Honest AI interview practice with realistic voice & text follow-ups, published rubrics, delivery analytics, and role-specific technical rounds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
