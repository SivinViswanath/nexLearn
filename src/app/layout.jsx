import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import GlobalLoader from '@/components/GlobalLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MCQ Assessment Platform',
  description:
    'Professional online assessment platform for multiple choice questions',
  keywords: ['assessment', 'mcq', 'quiz', 'online test', 'examination'],
  authors: [{ name: 'MCQ Platform' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
            <GlobalLoader />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
