'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/actions';

const vendorNav = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: '📊' },
  { name: 'Inquiries', href: '/vendor/inquiries', icon: '💬' },
  { name: 'My Services', href: '/vendor/services', icon: '🛍️' },
  { name: 'Bookings', href: '/vendor/bookings', icon: '📅' },
  { name: 'Growth Analytics', href: '/vendor/analytics', icon: '📈' },
  { name: 'Earnings', href: '/vendor/earnings', icon: '💰' },
  { name: 'Reviews', href: '/vendor/reviews', icon: '⭐' },
  { name: 'My Profile', href: '/vendor/profile', icon: '🏪' },
];

interface VendorLayoutClientProps {
  children: React.ReactNode;
  user: { email?: string; user_metadata?: any };
}

export default function VendorLayoutClient({ children, user }: VendorLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white font-serif border-r border-[#DDD0BB]">
      {/* Header / Logo */}
      <div className="p-6 border-b border-[#DDD0BB]">
        <Link href="/vendor/dashboard">
          <img src="/eventverse-logo.png" alt="EventVerse" className="h-16 w-auto mb-2" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#C5A880]">⚜</span>
          <p className="text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans">Vendor Guild Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1 flex-1 font-sans text-xs font-semibold">
        {vendorNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/vendor/dashboard' && pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] shadow-sm font-bold'
                  : 'text-[#1F1E1B]/70 hover:bg-[#FAF6F0] hover:text-[#8A1C2C]'
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info / Signout */}
      <div className="p-4 border-t border-[#DDD0BB] bg-[#FFFDF8]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#8A1C2C] text-[#FAF0E0] font-bold flex items-center justify-center text-xs font-sans">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 font-sans">
            <p className="text-xs font-bold text-[#2C1810] truncate">
              {user.user_metadata?.full_name || 'Vendor'}
            </p>
            <p className="text-[10px] text-[#1F1E1B]/50 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-2 text-xs text-[#8A1C2C] border border-[#DDD0BB] bg-[#FAF6F0] hover:bg-red-50 hover:border-red-200 rounded font-semibold font-sans transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[#DDD0BB] px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-[#2C1810] hover:bg-[#FAF6F0] rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-[#2C1810]">
              {vendorNav.find((item) =>
                pathname === item.href || (item.href !== '/vendor/dashboard' && pathname.startsWith(item.href))
              )?.name || 'Vendor Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF6F0] border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-bold uppercase tracking-wider font-sans">
              🏛️ Vendor Guild
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
