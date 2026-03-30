'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock, HelpCircle, LogOut, X } from 'lucide-react';

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const getClass = (path: string, exact = false) => {
    let active = false;
    if (exact) active = pathname === path;
    else if (path === '/boards') active = pathname?.startsWith('/boards') || pathname?.startsWith('/board/');
    else active = pathname?.startsWith(path);

    return active
      ? 'flex items-center gap-3 bg-surface text-primary rounded-l-full ml-4 pl-4 py-3 text-sm font-bold transition-all translate-x-1 duration-200'
      : 'flex items-center gap-3 text-on-surface opacity-60 hover:opacity-100 ml-4 pl-4 py-3 text-sm font-medium transition-all hover:bg-surface-container-low/50';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6 flex-1">
        <div className="flex items-center justify-between px-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <div>
              <p className="text-base font-bold text-on-surface font-serif leading-tight">Milo Studio</p>
              <p className="text-xs opacity-60 font-medium">Main Workspace</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full transition-colors lg:hidden">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          <Link href="/" onClick={onClose} className={getClass('/', true)}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </Link>
          <Link href="/boards" onClick={onClose} className={getClass('/boards')}>
            <span className="material-symbols-outlined text-[20px] shrink-0">dashboard</span>
            <span>My Boards</span>
          </Link>
          <Link href="#" className={getClass('/team')}>
            <Users className="w-4 h-4 shrink-0" />
            <span>Team Space</span>
          </Link>
          <Link href="#" className={getClass('/timeline')}>
            <Clock className="w-4 h-4 shrink-0" />
            <span>Timeline</span>
          </Link>
        </nav>
      </div>

      <div className="pb-8 border-t border-outline-variant/20 pt-4">
        <Link href="#" className={getClass('/help')}>
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Help</span>
        </Link>
        <Link href="#" className={getClass('/logout')}>
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}

/** Desktop sidebar – always visible on lg+ */
export default function Sidebar() {
  return (
    <aside className="w-64 fixed left-0 top-[65px] h-[calc(100vh-65px)] bg-surface-container-high hidden lg:flex flex-col border-r border-outline-variant/20 z-30">
      <SidebarContent />
    </aside>
  );
}

/** Mobile drawer sidebar */
export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 h-full w-72 z-50 bg-surface-container-high flex flex-col shadow-ambient lg:hidden">
        <div className="pt-4 h-full">
          <SidebarContent onClose={onClose} />
        </div>
      </aside>
    </>
  );
}
