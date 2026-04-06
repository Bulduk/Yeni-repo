'use client';

import { BarChart2, Activity, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100] bg-bg-surface border-t border-border-color pb-[env(safe-area-inset-bottom,0rem)]">
      <div className="flex justify-around items-center h-16 px-2 relative">
        <Link href="/" className={`flex flex-col items-center justify-center w-16 ${pathname === '/' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}>
          <div className={`w-7 h-7 rounded-full border-2 ${pathname === '/' ? 'border-text-primary' : 'border-border-color'} flex items-center justify-center mb-1`}>
            <span className="font-bold text-xs">N</span>
          </div>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link href="/market" className={`flex flex-col items-center justify-center w-16 ${pathname === '/market' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}>
          <BarChart2 className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Markets</span>
        </Link>
        
        <div className="w-16 flex justify-center">
          <button className="absolute -top-5 w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-base)] shadow-[0_0_20px_rgba(var(--accent),0.4)] border-4 border-bg-surface hover:scale-105 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <Link href="/pulse" className={`flex flex-col items-center justify-center w-16 ${pathname === '/pulse' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}>
          <Activity className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Pulse</span>
        </Link>
        
        <Link href="/profile" className={`flex flex-col items-center justify-center w-16 ${pathname === '/profile' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}>
          <User className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}
