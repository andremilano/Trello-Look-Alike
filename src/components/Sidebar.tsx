'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock, HelpCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string, exact: boolean = false) => {
    let isActive = false;
    if (exact) {
      isActive = pathname === path;
    } else if (path === '/boards') {
      isActive = pathname?.startsWith('/boards') || pathname?.startsWith('/board/');
    } else {
      isActive = pathname?.startsWith(path);
    }
    
    if (isActive) {
      return "flex items-center gap-3 bg-surface text-primary rounded-l-full ml-4 pl-4 py-3 font-sans text-sm font-bold transition-all translate-x-1 duration-200";
    } else {
      return "flex items-center gap-3 text-on-surface opacity-60 hover:opacity-100 ml-4 pl-4 py-3 font-sans text-sm font-medium transition-all hover:bg-surface-container-low/50";
    }
  };

  return (
    <aside className="w-64 fixed left-0 top-[65px] h-[calc(100vh-65px)] bg-surface-container-high hidden lg:flex flex-col border-r border-outline-variant/20 z-30">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div>
            <p className="text-lg font-bold text-on-surface font-serif">Editorial Studio</p>
            <p className="text-xs opacity-60 font-medium font-sans">Main Workspace</p>
          </div>
        </div>
        <nav className="space-y-1">
          <Link href="/" className={getLinkClass('/', true)}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/boards" className={getLinkClass('/boards')}>
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>My Boards</span>
          </Link>
          <Link href="#" className={getLinkClass('/team')}>
            <Users className="w-4 h-4" />
            <span>Team Space</span>
          </Link>
          <Link href="#" className={getLinkClass('/timeline')}>
            <Clock className="w-4 h-4" />
            <span>Timeline</span>
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto pb-8 border-t border-outline-variant/20 pt-4">
        <Link href="#" className={getLinkClass('/help')}>
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </Link>
        <Link href="#" className={getLinkClass('/logout')}>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
