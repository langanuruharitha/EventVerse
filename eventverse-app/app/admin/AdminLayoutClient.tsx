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

  useEffect(() => {
    async function fetchUser() {
      try {
        const { createBrowserClient } = await import('@/lib/supabase/client');
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();

          const displayName =
            profile?.full_name ||
            user.email?.split('@')[0]?.replace(/[._-]/g, ' ') ||
            'Admin';

          setAdmin({
            email: user.email,
            full_name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
            role: 'Admin',
          });
        } else {
          setAdmin({ email: 'admin@eventverse.com', full_name: 'System Admin', role: 'Super Admin' });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setAdmin({ email: 'admin@eventverse.com', full_name: 'System Admin', role: 'Super Admin' });
      }
    }

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const { createBrowserClient } = await import('@/lib/supabase/client');
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1F1E1B] text-[#FAF0E0] font-serif border-r border-[#C5A880]/30">
      {/* Logo */}
      <div className="p-6 border-b border-[#C5A880]/20 bg-[#2C1810]">
        <Link href="/admin/dashboard">
          <img src="/eventverse-logo.png" alt="EventVerse" className="h-16 w-auto mb-2" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#C5A880]">⚜</span>
          <p className="text-xs font-bold text-[#C5A880] uppercase tracking-wider font-sans">Admin Control Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1 flex-1 font-sans text-xs font-semibold">
        {adminNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] shadow-sm font-bold border border-[#C5A880]/30'
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
      <div className="p-4 border-t border-[#C5A880]/20 bg-[#2C1810]/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#8A1C2C] text-[#FAF0E0] font-bold flex items-center justify-center text-xs font-sans border border-[#C5A880]/30">
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
          className="w-full py-2 text-xs text-[#FAF0E0] bg-[#8A1C2C] hover:bg-[#6B1522] border border-[#C5A880]/30 rounded font-semibold font-sans transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
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
              {adminNav.find((item) =>
                pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
              )?.name || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
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
