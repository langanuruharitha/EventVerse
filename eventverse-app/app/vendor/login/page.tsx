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
        // Not a vendor account
        setError('This account is not registered as a vendor. Please use the customer portal.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center">
            <div className="flex justify-center mb-3">
              <img
                src="/eventverse-logo.png"
                alt="EventVerse Logo"
                className="h-16 object-contain brightness-0 invert"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏪</span>
              <h1 className="text-2xl font-bold text-white">Vendor Portal</h1>
            </div>
            <p className="text-orange-100 text-sm mt-1">Sign in to manage your services &amp; bookings</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                  placeholder="vendor@example.com"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-orange-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-200 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In to Vendor Portal'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-center">
              <p className="text-sm text-gray-600">
                Not registered as a vendor?{' '}
                <Link href="/vendor/register" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Apply here
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                Customer?{' '}
                <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-medium">
                  Go to Customer Portal →
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
