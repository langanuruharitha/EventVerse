'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/actions';

const vendorNav = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: '📊' },
  { name: 'My Services', href: '/vendor/services', icon: '🛍️' },
  { name: 'Bookings', href: '/vendor/bookings', icon: '📅' },
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
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-orange-100">
        <Link href="/vendor/dashboard">
          <img src="/eventverse-logo.png" alt="EventVerse" className="h-20 w-auto mb-3" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏪</span>
          <p className="text-base font-bold text-orange-700">Vendor Portal</p>
        </div>
      </div>

      <nav className="px-4 py-4 space-y-1 flex-1">
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
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-orange-100 bg-orange-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.user_metadata?.full_name || 'Vendor'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 bg-white/90 backdrop-blur-xl border-r border-orange-200 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-orange-200 lg:hidden">
          <SidebarContent />
        </aside>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-sm">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-orange-50"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                🏪 Vendor Portal
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
