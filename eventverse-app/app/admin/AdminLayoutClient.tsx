'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Notifications', href: '/admin/notifications', icon: '🔔' },
  { name: 'Vendors Moderation', href: '/admin/vendors', icon: '🏪' },
  { name: 'Users Management', href: '/admin/users', icon: '👥' },
  { name: 'Platform Bookings', href: '/admin/bookings', icon: '📅' },
  { name: 'Reviews Moderation', href: '/admin/reviews', icon: '⭐' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { name: 'Profile', href: '/admin/profile', icon: '👤' },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Skip auth enforcement on standalone login/reset/setup pages
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password' ||
    pathname === '/admin/debug' ||
    pathname === '/admin/setup';

  useEffect(() => {
    if (isAuthPage) {
      setCheckingAuth(false);
      return;
    }

    async function checkAdminAuth() {
      setCheckingAuth(true);
      try {
        const { createBrowserClient } = await import('@/lib/supabase/client');
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Must have an active user session
        if (!user) {
          console.warn('No active session found. Redirecting to /admin/login');
          setAdmin(null);
          router.replace('/admin/login');
          return;
        }

        // Check admin_users table for verification
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Check if user is registered in admin_users or has admin email role
        const isAuthorizedAdmin =
          adminRecord?.is_active ||
          user.email?.toLowerCase().includes('admin');

        if (!isAuthorizedAdmin) {
          console.warn('User is not an authorized admin. Redirecting to /admin/login');
          setAdmin(null);
          router.replace('/admin/login');
          return;
        }

        const displayName =
          adminRecord?.full_name ||
          user.email?.split('@')[0]?.replace(/[._-]/g, ' ') ||
          'Admin';

        setAdmin({
          email: user.email,
          full_name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          role: adminRecord?.role || 'Super Admin',
        });
      } catch (error) {
        console.error('Error verifying admin authentication:', error);
        setAdmin(null);
        router.replace('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAdminAuth();
  }, [pathname, isAuthPage, router]);

  const handleSignOut = async () => {
    try {
      const { createBrowserClient } = await import('@/lib/supabase/client');
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setAdmin(null);
    router.replace('/admin/login');
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#1F1E1B] flex flex-col items-center justify-center font-serif text-[#FAF0E0] p-4">
        <div className="text-center space-y-3 max-w-sm bg-[#2C1810] border-2 border-double border-[#C5A880] p-8 rounded shadow-2xl">
          <div className="animate-spin text-4xl text-[#C5A880]">⚜</div>
          <h2 className="text-base font-bold tracking-wide">Authenticating Admin Access...</h2>
          <p className="text-xs text-[#C5A880] font-sans italic">Verifying credentials for Admin Command Center</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1F1E1B] text-[#FAF0E0] font-serif border-r border-[#C5A880]/30 shadow-2xl">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-[#C5A880]/20 bg-[#2C1810]">
        <Link href="/admin/dashboard" className="block mb-2">
          <img src="/eventverse-logo.png" alt="EventVerse" className="h-14 w-auto" />
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#C5A880]">⚜</span>
          <p className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider font-sans">
            Admin Command Center
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 py-4 space-y-1 flex-1 font-sans text-xs font-semibold overflow-y-auto">
        {adminNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3.5 py-3 rounded transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] shadow font-bold border border-[#C5A880]/40'
                  : 'text-[#FAF0E0]/70 hover:bg-[#2C1810] hover:text-[#FAF0E0]'
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
      <div className="p-4 border-t border-[#C5A880]/20 bg-[#2C1810]/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#8A1C2C] text-[#FAF0E0] font-bold flex items-center justify-center text-xs font-sans border border-[#C5A880]/40 flex-shrink-0">
            {admin?.full_name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0 font-sans">
            <p className="text-xs font-bold text-[#FAF0E0] truncate">
              {admin?.full_name || 'System Admin'}
            </p>
            <p className="text-[10px] text-[#C5A880] truncate">{admin?.email || 'admin@eventverse.com'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-2 text-xs text-[#FAF0E0] bg-[#8A1C2C] hover:bg-[#6B1522] border border-[#C5A880]/30 rounded font-semibold font-sans transition uppercase tracking-wider"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Desktop Sidebar (visible on screens >= md: 768px) */}
      <aside className="fixed top-0 left-0 z-30 hidden md:flex flex-col h-full w-64">
        <SidebarContent />
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out md:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#DDD0BB] px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-[#2C1810] hover:bg-[#FAF6F0] rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base sm:text-lg font-bold text-[#2C1810]">
              {adminNav.find((item) =>
                pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
              )?.name || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2C1810] text-[#C5A880] border border-[#C5A880]/30 text-[10px] font-bold uppercase tracking-wider font-sans">
              👑 Admin Command
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
