'use client';

import { useState } from 'react';

export default function AdminDebugPage() {
  const [email, setEmail] = useState('harithalanganuru@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkUser = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Call the debug API endpoint
      const response = await fetch('/api/admin/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        statusText: response.statusText,
        ...data,
      });
    } catch (err: any) {
      setResult({
        error: true,
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Admin Login Debug Tool
          </h1>
          <p className="text-gray-600 mb-8">
            This page helps diagnose admin login issues
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password (optional - leave blank to skip auth test)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter password to test authentication"
              />
            </div>

            <button
              onClick={checkUser}
              disabled={loading || !email}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Run Diagnostic'}
            </button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className={`p-4 rounded-lg ${
                result.error || result.status >= 400
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <h3 className="font-semibold text-lg mb-2">
                  {result.error || result.status >= 400 ? '❌ Issues Found' : '✅ Results'}
                </h3>
                <p className="text-sm">
                  HTTP Status: {result.status} {result.statusText}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">User Information:</h4>
                <pre className="text-sm bg-white p-4 rounded border overflow-auto">
                  {JSON.stringify(result.user, null, 2)}
                </pre>
              </div>

              {result.admin && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Admin Profile:</h4>
                  <pre className="text-sm bg-white p-4 rounded border overflow-auto">
                    {JSON.stringify(result.admin, null, 2)}
                  </pre>
                </div>
              )}

              {result.authTest && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Authentication Test:</h4>
                  <pre className="text-sm bg-white p-4 rounded border overflow-auto">
                    {JSON.stringify(result.authTest, null, 2)}
                  </pre>
                </div>
              )}

              {result.checks && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Diagnostic Checks:</h4>
                  <ul className="space-y-2">
                    {Object.entries(result.checks).map(([key, value]: [string, any]) => (
                      <li key={key} className="flex items-start">
                        <span className={`mr-2 ${value.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {value.passed ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <strong>{key}:</strong> {value.message}
                          {value.details && (
                            <pre className="text-xs mt-1 bg-white p-2 rounded">
                              {JSON.stringify(value.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Message:</h4>
                  <p className="text-sm">{result.message}</p>
                </div>
              )}

              {result.error && typeof result.error === 'string' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Error:</h4>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">📋 What This Tool Checks:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Whether the user exists in Supabase auth.users</li>
              <li>Email confirmation status</li>
              <li>Admin profile in admin_users table</li>
              <li>Admin account active status</li>
              <li>If password provided: authentication test</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">🔧 Common Fixes:</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>
                <strong>Password Issues:</strong> Go to Supabase Dashboard → Authentication → 
                Users → Find your email → Click three dots → Update user → Set new password
              </li>
              <li>
                <strong>Email Not Confirmed:</strong> In same menu, check "Email confirmed" 
                checkbox and save
              </li>
              <li>
                <strong>Admin Profile Missing:</strong> Run the SQL from FINAL-CREATE-ADMIN.sql 
                in Supabase SQL Editor
              </li>
              <li>
                <strong>Account Inactive:</strong> Run: 
                <code className="bg-gray-200 px-2 py-1 rounded text-xs ml-1">
                  UPDATE admin_users SET is_active = true WHERE email = 'your@email.com'
                </code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
