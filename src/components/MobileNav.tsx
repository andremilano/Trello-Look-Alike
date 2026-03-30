'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { MobileSidebar } from './Sidebar';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 hover:bg-surface-container-low rounded-full transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-on-surface" />
      </button>
      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
