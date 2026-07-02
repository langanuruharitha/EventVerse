'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { signOut } from '@/lib/auth/actions';
import { Avatar } from '@/components/ui/Avatar';

const customerNav = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'My Events', href: '/events/my-events', icon: '🎉' },
  { name: 'Create Invitation', href: '/invitations', icon: '💌' },
  { name: 'AI Design Studio', href: '/design-studio', icon: '🎨' },
  { name: 'Venues', href: '/venues', icon: '🏛️' },
  { name: 'Shop', href: '/shop', icon: '🛍️' },
  { name: 'Guests', href: '/guests', icon: '👥' },
  { name: 'Budget', href: '/dashboard/budget', icon: '💰' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200">
      <div className="p-6">
        <Link href="/dashboard">
          <img 
            src="/eventverse-logo.png" 
            alt="EventVerse" 
            className="h-24 w-auto mb-3"
          />
        </Link>
        <p className="text-lg font-semibold text-gray-700">Customer Portal</p>
      </div>

      <nav className="px-4 space-y-2 flex-1">
        {customerNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
            (item.href === '/dashboard' && pathname === '/dashboard');
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

      {user && (
        <div className="p-4 border-t border-gray-200 bg-white/80">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              fallback={user.email}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 lg:hidden">
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" onClick={onClose}>
            <img 
              src="/eventverse-logo.png" 
              alt="EventVerse" 
              className="h-20 w-auto"
            />
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {customerNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
              (item.href === '/dashboard' && pathname === '/dashboard');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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

        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/95">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
