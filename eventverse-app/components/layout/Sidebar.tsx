'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { signOut } from '@/lib/auth/actions';
import { Avatar } from '@/components/ui/Avatar';
import { Sparkles } from 'lucide-react';

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
    <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 bg-[#0d1026]/75 backdrop-blur-xl border-r border-white/5">
      <div className="p-6 border-b border-white/5 mb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0d1026] border border-white/10 rounded-lg p-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-pink-400 transition-colors" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent tracking-tight">
            EventVerse
          </span>
        </Link>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Customer Workspace</p>
      </div>

      <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto">
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
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-white/5 bg-[#0a0c1f]/80">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              fallback={user.email}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium border border-red-500/20"
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
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-[#0d1026]/95 backdrop-blur-xl border-r border-white/5 lg:hidden flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
              <div className="relative bg-[#0d1026] border border-white/10 rounded-lg p-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EventVerse</span>
            </Link>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1.5 overflow-y-auto">
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
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {user && (
          <div className="p-4 border-t border-white/5 bg-[#0a0c1f]/95">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                fallback={user.email}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium border border-red-500/20"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
