import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import GlobalModals from '@/components/GlobalModals';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Predix - Next-Gen Prediction Market',
  description: 'A fast, intelligent, decision-driven prediction trading system.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-bg-base text-text-primary antialiased font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <GlobalModals />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
