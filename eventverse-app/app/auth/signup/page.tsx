'use client';

import { useState } from 'react';
import { signUp } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await signUp({ email, password, full_name: fullName, role });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setMessage(result.message || 'Account created successfully! Redirecting to sign in...');

      try {
        await fetch('/api/admin/notify-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, fullName, role, type: 'signup' }),
        });
      } catch (error) {
        console.error('Failed to notify admin:', error);
      }

      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    }
  };

  const inputStyle = {
    background: '#FFFDF8',
    border: '1.5px solid #DDD0BB',
    color: '#2C1810',
    fontFamily: 'Georgia, serif',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#C5A880';
    e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#DDD0BB';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 50%, #EDE0CC 100%)' }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8A1C2C 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />
        <svg className="absolute top-6 left-6 w-24 h-24 opacity-10" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#8A1C2C" strokeWidth="1.5" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-24 h-24 opacity-10 rotate-180" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#8A1C2C" strokeWidth="1.5" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
      </div>

      <div className="w-full max-w-md relative">
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
          <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: '1px solid #EAE0CE' }}>
            <div className="flex justify-center mb-4">
              <img
                src="/eventverse-logo.png"
                alt="EventVerse Logo"
                className="h-14 object-contain"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(138,28,44,0.2))' }}
              />
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" fill="#C5A880" />
              </svg>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#2C1810' }}>
              Create Account
            </h1>
            <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Join EventVerse and plan amazing events
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            {message && (
              <div className="mb-4 p-3 rounded text-sm text-center"
                style={{ background: '#F0FFF4', border: '1px solid #B5DCC5', color: '#1A5C35' }}>
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded text-sm text-center"
                style={{ background: '#FFF0F0', border: '1px solid #F5BDBD', color: '#8A1C2C' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                  placeholder="Your Full Name"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

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
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  minLength={6}
                  className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['customer', 'vendor'] as const).map((r) => (
                    <label
                      key={r}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded cursor-pointer transition-all duration-200 text-sm font-medium"
                      style={{
                        border: `1.5px solid ${role === r ? '#8A1C2C' : '#DDD0BB'}`,
                        background: role === r ? 'rgba(138,28,44,0.06)' : '#FFFDF8',
                        color: role === r ? '#8A1C2C' : '#7A6652',
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        className="sr-only"
                      />
                      {r === 'customer' ? '👤' : '🏪'} {r.charAt(0).toUpperCase() + r.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 disabled:opacity-50 mt-2"
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 pt-4 text-center" style={{ borderTop: '1px solid #EAE0CE' }}>
              <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-semibold" style={{ color: '#8A1C2C' }}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-1 w-full rounded-b-sm" style={{ background: 'linear-gradient(90deg, #C5A880, #8A1C2C, #C5A880)' }} />
      </div>
    </div>
  );
}
