import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Minimalist Trello',
  description: 'A beautiful, minimalist project management tool.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-sans min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 backdrop-blur-[20px]">
          <div className="container mx-auto h-14 flex items-center px-4">
            <h1 className="text-xl font-semibold tracking-tight font-serif text-on-surface">MiniTrello</h1>
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
