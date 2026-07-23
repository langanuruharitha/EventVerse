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
      // Redirect to appropriate dashboard
      router.push(result.redirect || '/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/eventverse-logo.png" 
              alt="EventVerse Logo" 
              className="h-20 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to EventVerse</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center pt-4 border-t border-gray-200 flex items-center justify-center gap-4">
          <Link 
            href="/vendor/login" 
            className="text-sm text-gray-500 hover:text-orange-600 font-medium inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Vendor Login
          </Link>
        </div>
      </div>
    </div>
  );
}
