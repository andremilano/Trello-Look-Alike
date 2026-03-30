import type { Metadata } from 'next';
import { Manrope, Noto_Serif } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const notoSerif = Noto_Serif({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-serif' });

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
      <body className={`${manrope.variable} ${notoSerif.variable} font-sans min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto h-14 flex items-center px-4">
            <h1 className="text-xl font-semibold tracking-tight font-serif">MiniTrello</h1>
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
