'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorLoginPage() {
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

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      const role = result.userData?.role;
      if (role === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        setError('This account is not registered as a vendor. Please use the customer portal.');
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 50%, #EDE0CC 100%)' }}
    >
      {/* Background ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #9B7A4A 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />
        <svg className="absolute top-6 left-6 w-24 h-24 opacity-10" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#9B7A4A" strokeWidth="1.5" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-24 h-24 opacity-10 rotate-180" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#9B7A4A" strokeWidth="1.5" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
      </div>

      <div className="w-full max-w-md relative">
        {/* Vendor accent — warm gold instead of crimson */}
        <div className="h-1 w-full rounded-t-sm" style={{ background: 'linear-gradient(90deg, #9B7A4A, #C5A880, #9B7A4A)' }} />

        <div
          className="rounded-b-sm shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #FFFDF8 0%, #FBF5EC 100%)',
            border: '1px solid #DDD0BB',
            borderTop: 'none',
            boxShadow: '0 25px 60px rgba(155,122,74,0.12), 0 8px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: '1px solid #EAE0CE' }}>
            <div className="flex justify-center mb-3">
              <img
                src="/eventverse-logo.png"
                alt="EventVerse Logo"
                className="h-14 object-contain"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(155,122,74,0.25))' }}
              />
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
              <span className="text-lg">🏪</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#2C1810' }}>
              Vendor Portal
            </h1>
            <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Sign in to manage your services &amp; bookings
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
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                  placeholder="vendor@example.com"
                  style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810', fontFamily: 'Georgia, serif' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C5A880'; e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#DDD0BB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                  placeholder="••••••••"
                  style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C5A880'; e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#DDD0BB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[#9B7A4A]" />
                  <span className="text-xs" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium"
                  style={{ color: '#9B7A4A', fontFamily: 'Georgia, serif' }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #9B7A4A 0%, #7A5C35 100%)',
                  color: '#FAF0E0',
                  letterSpacing: '0.1em',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 4px 16px rgba(155,122,74,0.3)',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #B08C55 0%, #8A6C3F 100%)'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9B7A4A 0%, #7A5C35 100%)'; }}
              >
                {loading ? (
                  'Signing In...'
                ) : (
                  'Sign In to Vendor Portal'
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-5 pt-4 space-y-3 text-center" style={{ borderTop: '1px solid #EAE0CE' }}>
              <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                Not registered as a vendor?{' '}
                <Link href="/vendor/register" className="font-semibold" style={{ color: '#9B7A4A' }}>
                  Apply here
                </Link>
              </p>
              <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                Customer?{' '}
                <Link href="/auth/signin" className="font-semibold" style={{ color: '#8A1C2C' }}>
                  Go to Customer Portal →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-1 w-full rounded-b-sm" style={{ background: 'linear-gradient(90deg, #C5A880, #9B7A4A, #C5A880)' }} />
      </div>
    </div>
  );
}
