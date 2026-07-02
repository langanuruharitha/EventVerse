'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { signOut } from '@/lib/auth/actions';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  role: 'customer' | 'vendor' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  role,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const customerNav = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Events', href: '/events/my-events', icon: '🎉' },
    { name: 'Shop', href: '/shop', icon: '🛍️' },
    { name: 'Budget', href: '/dashboard/budget', icon: '💰' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ];

  const vendorNav = [
    { name: 'Dashboard', href: '/vendor/dashboard', icon: '📊' },
    { name: 'Bookings', href: '/vendor/bookings', icon: '📅' },
    { name: 'Services', href: '/vendor/services', icon: '🛍️' },
    { name: 'Reviews', href: '/vendor/reviews', icon: '⭐' },
    { name: 'Profile', href: '/vendor/profile', icon: '👤' },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Vendors', href: '/admin/vendors', icon: '🏪' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  const navigation = role === 'admin' ? adminNav : role === 'vendor' ? vendorNav : customerNav;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200
          transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6">
          <img 
            src="/eventverse-logo.png" 
            alt="EventVerse" 
            className="h-24 w-auto mb-3"
          />
          <p className="text-lg font-semibold text-gray-700 capitalize">{role} Portal</p>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/80">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              src={user?.profile?.avatar_url}
              fallback={user?.profile?.full_name || user?.email}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
