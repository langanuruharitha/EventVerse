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
  { name: 'Task Checklist', href: '/tasks', icon: '📋' },
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
    <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 bg-[#1F1E1B] border-r border-[#C5A880]/30 shadow-xl">
      <div className="p-4 border-b border-[#C5A880]/20 mb-4">
        <Link href="/dashboard" className="block mb-1.5">
          <img src="/eventverse-logo.png" alt="EventVerse" className="h-16 w-auto object-contain" />
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]/70 font-sans">Customer Workspace</p>
      </div>

      <nav className="px-3 space-y-1 flex-1 overflow-y-auto font-sans">
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
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-decoration-none
                ${isActive
                  ? 'bg-[#C5A880] text-[#1F1E1B] font-bold border-l-4 border-[#8A1C2C] shadow-md'
                  : 'text-[#FAF6F0]/70 hover:bg-[#C5A880]/15 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-[#C5A880]/20 bg-[#131211]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              fallback={user.email}
              size="md"
            />
            <div className="flex-1 min-w-0 font-sans">
              <p className="text-sm font-semibold text-white truncate">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-[#FAF6F0]/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 text-xs text-[#FAF6F0] hover:bg-[#8A1C2C] bg-[#8A1C2C]/80 rounded-lg transition-all font-semibold border border-[#8A1C2C]"
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
        className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-[#1F1E1B] border-r border-[#C5A880]/30 lg:hidden flex flex-col justify-between shadow-2xl">
        <div>
          <div className="px-4 py-3 flex items-center justify-between border-b border-[#C5A880]/20">
            <Link href="/dashboard" onClick={onClose}>
              <img src="/eventverse-logo.png" alt="EventVerse" className="h-12 w-auto object-contain" />
            </Link>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#C5A880]/15 text-[#FAF6F0]/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="px-3 py-6 space-y-1 overflow-y-auto font-sans">
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
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-decoration-none
                    ${isActive
                      ? 'bg-[#C5A880] text-[#1F1E1B] font-bold border-l-4 border-[#8A1C2C]'
                      : 'text-[#FAF6F0]/70 hover:bg-[#C5A880]/15 hover:text-white'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {user && (
          <div className="p-4 border-t border-[#C5A880]/20 bg-[#131211]">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                fallback={user.email}
                size="md"
              />
              <div className="flex-1 min-w-0 font-sans">
                <p className="text-sm font-semibold text-white truncate">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-[#FAF6F0]/50 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-xs text-[#FAF6F0] hover:bg-[#8A1C2C] bg-[#8A1C2C]/80 rounded-lg transition-all font-semibold border border-[#8A1C2C]"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
