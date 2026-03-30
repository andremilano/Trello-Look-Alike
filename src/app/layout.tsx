import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Bell, Settings, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Workspace | The Earthbound Editorial',
  description: 'A beautiful, minimalist project management tool.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-sans min-h-screen flex flex-col bg-surface text-on-surface`}>
        {/* Material Symbols */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        {/* Top Navigation Bar */}
        <header className="bg-surface docked full-width top-0 sticky z-40 flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="text-xl font-extrabold text-on-surface font-serif tracking-tight">ManageIt</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 group focus-within:ring-1 ring-primary/20">
              <Search className="text-sm opacity-50 w-4 h-4 mr-2" />
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-on-surface/40 outline-none" placeholder="Search publications..." type="text" />
            </div>
            <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-150">
              <Bell className="w-5 h-5 text-on-surface" />
            </button>
            <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-150">
              <Settings className="w-5 h-5 text-on-surface" />
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-xs text-on-surface-variant overflow-hidden border border-outline-variant/20">
              ME
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          {/* Main Content Canvas */}
          <main className="flex-1 lg:ml-64 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
