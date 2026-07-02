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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {success ? (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium mb-2">Check your email!</p>
            <p className="text-green-700 text-sm">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/auth/signin" 
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Sign In
          </Link>
        </div>

        {success && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the email?{' '}
              <button 
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Try again
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
