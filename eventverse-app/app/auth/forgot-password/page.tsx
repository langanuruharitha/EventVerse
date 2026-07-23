'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/lib/auth/actions';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await requestPasswordReset(email);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
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
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8A1C2C 0%, #C5A880 100%)' }}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" fill="#C5A880" />
              </svg>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#2C1810' }}>
              Reset Password
            </h1>
            <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              {success ? 'Check your inbox for the reset link' : "Enter your email and we'll send a reset link"}
            </p>
          </div>

          <div className="px-8 py-6">
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(26,92,53,0.1)', border: '2px solid #B5DCC5' }}>
                  <svg className="w-8 h-8" fill="none" stroke="#1A5C35" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold mb-1" style={{ color: '#1A5C35', fontFamily: 'Georgia, serif' }}>Email Sent!</p>
                <p className="text-sm mb-4" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                  Reset link sent to <strong>{email}</strong>
                </p>
                <button
                  onClick={() => { setSuccess(false); setEmail(''); }}
                  className="text-sm underline"
                  style={{ color: '#8A1C2C', fontFamily: 'Georgia, serif' }}
                >
                  Didn&apos;t receive it? Try again
                </button>
              </div>
            ) : (
              <>
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
                      placeholder="your@email.com"
                      style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810', fontFamily: 'Georgia, serif' }}
                      onFocus={(e) => { e.target.style.borderColor = '#C5A880'; e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#DDD0BB'; e.target.style.boxShadow = 'none'; }}
                    />
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
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}

            <div className="mt-5 pt-4 text-center" style={{ borderTop: '1px solid #EAE0CE' }}>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: '#8A1C2C', fontFamily: 'Georgia, serif' }}
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="h-1 w-full rounded-b-sm" style={{ background: 'linear-gradient(90deg, #C5A880, #8A1C2C, #C5A880)' }} />
      </div>
    </div>
  );
}
