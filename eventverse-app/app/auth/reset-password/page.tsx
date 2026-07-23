'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

export default function ResetPasswordPage() {
  const toast = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionReady(true);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      await supabase.auth.signOut();
      toast('Password updated successfully! Please sign in with your new password.', 'success');
      router.push('/auth/signin');
    }
  };

  const pageWrap = (content: React.ReactNode) => (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 50%, #EDE0CC 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8A1C2C 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />
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
          {content}
        </div>
        <div className="h-1 w-full rounded-b-sm" style={{ background: 'linear-gradient(90deg, #C5A880, #8A1C2C, #C5A880)' }} />
      </div>
    </div>
  );

  if (checking) {
    return pageWrap(
      <div className="px-8 py-12 text-center">
        <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: '#C5A880', borderTopColor: 'transparent' }} />
        <p style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Verifying reset link...
        </p>
      </div>
    );
  }

  if (!sessionReady) {
    return pageWrap(
      <div className="px-8 py-10 text-center">
        <div className="px-5 pt-6 pb-2 text-center" style={{ borderBottom: '1px solid #EAE0CE' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
              <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" fill="#C5A880" />
            </svg>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
          </div>
        </div>
        <div className="py-6">
          <p className="text-4xl mb-3">⚠️</p>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2C1810' }}>
            Link Expired or Invalid
          </h1>
          <p className="text-sm mb-6" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block px-6 py-2.5 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
              color: '#FAF0E0',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 4px 16px rgba(138,28,44,0.3)',
            }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return pageWrap(
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: '1px solid #EAE0CE' }}>
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8A1C2C 0%, #C5A880 100%)' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
          Set New Password
        </h1>
        <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Choose a strong password for your account
        </p>
      </div>

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
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
              placeholder="••••••••"
              style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810' }}
              onFocus={(e) => { e.target.style.borderColor = '#C5A880'; e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#DDD0BB'; e.target.style.boxShadow = 'none'; }}
            />
            <p className="mt-1 text-xs" style={{ color: '#9B8B7A', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Minimum 8 characters
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
              placeholder="••••••••"
              style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810' }}
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
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

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
    </>
  );
}
