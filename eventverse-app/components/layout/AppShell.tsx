'use client';

import { useState } from 'react';
import Navigation from './Navigation';
import Sidebar, { MobileSidebar } from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif relative overflow-x-hidden">
      {/* Background traditional accents */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#C5A880]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#8A1C2C]/5 blur-[120px] pointer-events-none" />

      <Sidebar />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navigation onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-[#FAF6F0]">{children}</main>
      </div>
    </div>
  );
}
