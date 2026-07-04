'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Vendors Moderation', href: '/admin/vendors', icon: '🏪' },
  { name: 'Users Management', href: '/admin/users', icon: '👥' },
  { name: 'Platform Bookings', href: '/admin/bookings', icon: '📅' },
  { name: 'Reviews Moderation', href: '/admin/reviews', icon: '⭐' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { name: 'Profile', href: '/admin/profile', icon: '👤' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch actual logged-in user
    async function fetchUser() {
      try {
        const { createBrowserClient } = await import('@/lib/supabase/client');
        const supabase = createBrowserClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user profile for full name
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          
          // Use full_name if available, otherwise extract username from email
          const displayName = profile?.full_name || user.email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Admin';
          
          setAdmin({
            email: user.email,
            full_name: displayName.charAt(0).toUpperCase() + displayName.slice(1), // Capitalize first letter
            role: 'Admin'
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

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/debug' || pathname.startsWith('/admin/setup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-rose-100">
        <Link href="/admin/dashboard">
          <img src="/eventverse-logo.png" alt="EventVerse" className="h-20 w-auto mb-3" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🛠️</span>
          <p className="text-base font-bold text-rose-700">Admin Control Panel</p>
        </div>
      </div>


      <nav className="px-4 py-4 space-y-1 flex-1">
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
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-200'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {admin && (
        <div className="p-4 border-t border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {admin.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {admin.full_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-30 hidden lg:flex flex-col h-full w-64 bg-white/90 backdrop-blur-xl border-r border-rose-200 shadow-sm">
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
        <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-rose-200 lg:hidden">
          <SidebarContent />
        </aside>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-rose-100 shadow-sm">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-rose-50"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-rose-600 font-medium bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                🛡️ System Administrator
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
