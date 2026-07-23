'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn({ email, password });

    console.log('SignIn Result:', result);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      console.log('SignIn Success! Redirect to:', result.redirect);
      console.log('User Role:', result.userData?.role);

      // Send notification before redirecting
      if (result.shouldNotify && result.userData) {
        try {
          await fetch('/api/admin/notify-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: result.userData.email,
              fullName: result.userData.fullName,
              role: result.userData.role,
              type: 'login',
            }),
          });
        } catch (error) {
          console.error('Failed to notify admin:', error);
        }
      }

      console.log('About to redirect to:', result.redirect || '/dashboard');
      router.push(result.redirect || '/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 50%, #EDE0CC 100%)' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8A1C2C 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />
        {/* Corner ornaments */}
        <svg className="absolute top-6 left-6 w-24 h-24 opacity-10" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#8A1C2C" strokeWidth="1.5" fill="none" />
          <path d="M15,5 Q15,15 5,15" stroke="#C5A880" strokeWidth="1" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
          <path d="M5,40 Q15,40 15,30" stroke="#C5A880" strokeWidth="1" fill="none" />
          <path d="M40,5 Q40,15 30,15" stroke="#C5A880" strokeWidth="1" fill="none" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-24 h-24 opacity-10 rotate-180" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#8A1C2C" strokeWidth="1.5" fill="none" />
          <path d="M15,5 Q15,15 5,15" stroke="#C5A880" strokeWidth="1" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
      </div>

      <div className="w-full max-w-md relative">
        {/* Top decorative border */}
        <div className="h-1 w-full rounded-t-sm" style={{ background: 'linear-gradient(90deg, #8A1C2C, #C5A880, #8A1C2C)' }} />

        <div
          className="rounded-b-sm shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #FFFDF8 0%, #FBF5EC 100%)',
            border: '1px solid #DDD0BB',
            borderTop: 'none',
            boxShadow: '0 25px 60px rgba(138,28,44,0.12), 0 8px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center"
            style={{ borderBottom: '1px solid #EAE0CE' }}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="/eventverse-logo.png"
                  alt="EventVerse Logo"
                  className="h-16 object-contain"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(138,28,44,0.2))' }}
                />
              </div>
            </div>
            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z"
                  fill="#C5A880" />
              </svg>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#2C1810', letterSpacing: '0.02em' }}>
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Sign in to continue your EventVerse journey
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            {error && (
              <div className="mb-4 p-3 rounded text-sm text-center"
                style={{ background: '#FFF0F0', border: '1px solid #F5BDBD', color: '#8A1C2C' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                  style={{ color: '#7A6652' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                  placeholder="your@email.com"
                  style={{
                    background: '#FFFDF8',
                    border: '1.5px solid #DDD0BB',
                    color: '#2C1810',
                    fontFamily: 'Georgia, serif',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#C5A880'; e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#DDD0BB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                  style={{ color: '#7A6652' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                  placeholder="••••••••"
                  style={{
                    background: '#FFFDF8',
                    border: '1.5px solid #DDD0BB',
                    color: '#2C1810',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#C5A880'; e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#DDD0BB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[#8A1C2C]" />
                  <span className="text-xs" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#8A1C2C', fontFamily: 'Georgia, serif' }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                  color: '#FAF0E0',
                  letterSpacing: '0.1em',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 4px 16px rgba(138,28,44,0.3)',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9E2232 0%, #7B1926 100%)'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)'; }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #EAE0CE' }}>
              <p className="text-center text-sm mb-3" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="font-semibold transition-colors" style={{ color: '#8A1C2C' }}>
                  Create Account
                </Link>
              </p>
              <div className="text-center">
                <Link
                  href="/vendor/login"
                  className="inline-flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded"
                  style={{ color: '#9B7A4A', fontFamily: 'Georgia, serif', background: '#F5EDD8', border: '1px solid #DDD0BB' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Vendor Portal Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="h-1 w-full rounded-b-sm" style={{ background: 'linear-gradient(90deg, #C5A880, #8A1C2C, #C5A880)' }} />
      </div>
    </div>
  );
}
