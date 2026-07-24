'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const adminObj = data.admin || {
          email: email,
          full_name: email.split('@')[0].replace(/[._-]/g, ' '),
          role: 'Super Admin'
        };
        try {
          localStorage.setItem('admin_session', JSON.stringify(adminObj));
          document.cookie = 'admin_authenticated=true; path=/; max-age=604800';
        } catch (e) {
          console.warn('Storage notice:', e);
        }
        router.push('/admin/dashboard');
      } else {
        const errorMsg = data.error || 'Login failed';
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1E1B] p-4 font-serif text-[#FAF0E0]">
      <div className="w-full max-w-md bg-[#2C1810] border-2 border-double border-[#C5A880] rounded shadow-2xl p-8 relative">
        <div className="absolute top-2 left-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute top-2 right-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute bottom-2 left-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute bottom-2 right-2 text-xs text-[#C5A880]">❦</div>

        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center mb-3">
            <img 
              src="/eventverse-logo.png" 
              alt="EventVerse Logo" 
              className="h-16 object-contain"
            />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880] text-[10px] font-bold uppercase tracking-widest font-sans">
            👑 Secret Admin Access
          </span>
          <h1 className="text-2xl font-bold text-[#FAF0E0] tracking-tight">Admin Command Portal</h1>
          <p className="text-xs text-[#C5A880] italic font-sans">Enter authorized system credentials to proceed</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/40 rounded text-red-200 text-xs font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#C5A880] mb-1">
              Admin Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#1F1E1B] border border-[#C5A880]/40 rounded text-[#FAF0E0] outline-none focus:border-[#C5A880]"
              placeholder="admin@eventverse.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#C5A880] mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#1F1E1B] border border-[#C5A880]/40 rounded text-[#FAF0E0] outline-none focus:border-[#C5A880]"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#FAF0E0]/70">
              <input type="checkbox" className="accent-[#8A1C2C] rounded" />
              <span>Remember session</span>
            </label>
            <Link 
              href="/admin/forgot-password" 
              className="text-[#C5A880] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] border border-[#C5A880]/30 text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow-lg disabled:opacity-50 transition"
          >
            {loading ? 'Authenticating Admin...' : 'Sign In to Admin Command'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2 font-sans text-xs">
          <Link 
            href="/" 
            className="text-[#C5A880] hover:underline block text-[11px]"
          >
            ← Return to EventVerse Main Site
          </Link>
        </div>

        <div className="mt-5 p-3 bg-[#1F1E1B]/60 border border-[#C5A880]/20 rounded font-sans">
          <p className="text-[10px] text-[#C5A880]/80 text-center italic">
            🔒 Restricted Area: Direct access required. Unauthorized attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
