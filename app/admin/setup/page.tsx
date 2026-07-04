'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/setup/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message || 'Admin access granted successfully!' });
        setEmail('');
      } else {
        setResult({ success: false, message: data.error || 'Failed to grant admin access' });
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/eventverse-logo.png" 
              alt="EventVerse Logo" 
              className="h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Grant admin access to users</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>User must already have an account (signed up via /auth/signup)</li>
            <li>Enter their email address below</li>
            <li>Click "Grant Super Admin Access"</li>
            <li>They can then login at /admin/login</li>
          </ol>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`mb-6 p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              {result.success ? (
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p>{result.message}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleGrantAccess} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="user@example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the email of the user you want to make an admin
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Granting Access...
              </span>
            ) : (
              '🔑 Grant Super Admin Access'
            )}
          </button>
        </form>

        {/* Manual Method */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">💻 Manual Method (SQL)</h3>
          <p className="text-sm text-gray-600 mb-3">
            If the form above doesn't work, you can grant access directly in Supabase:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-xs text-green-400 font-mono">
              {`INSERT INTO admin_users (user_id, role, permissions, full_name, email, is_active)
SELECT id, 'super_admin', 
  '{"manage_vendors":true,"manage_users":true,"manage_templates":true,"manage_support":true,"manage_analytics":true,"manage_settings":true,"manage_admins":true}'::jsonb,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin'), email, true
FROM auth.users WHERE email = 'user@example.com';`}
            </code>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 flex justify-between text-sm">
          <Link 
            href="/admin/login" 
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Admin Login
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-700 font-medium"
          >
            Go to Home
          </Link>
        </div>

        {/* Security Warning */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>Security Notice:</strong> This setup page should be protected in production. 
            Only authorized personnel should have access to this page.
          </p>
        </div>
      </div>
    </div>
  );
}
