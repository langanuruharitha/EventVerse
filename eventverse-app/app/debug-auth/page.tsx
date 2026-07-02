'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DebugAuthPage() {
  const [email, setEmail] = useState('harithalanganuru@gmail.com');
  const [result, setResult] = useState<any>(null);

  const checkUser = async () => {
    try {
      // Check if we can query users table (this tests RLS)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      // Check auth.users (won't work from client, but let's see the error)
      const { data: session } = await supabase.auth.getSession();

      setResult({
        email: email,
        usersTable: users,
        usersError: usersError?.message,
        currentSession: session.session ? 'Logged in' : 'Not logged in',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setResult({
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Auth Debug Tool</h1>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">⚠️ Important Information</h2>
          <p className="text-sm">
            If you're getting "Invalid credentials" error, it's likely because:
          </p>
          <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
            <li><strong>Email confirmation is enabled</strong> in Supabase</li>
            <li>Your account exists but is <strong>unconfirmed</strong></li>
            <li>Unconfirmed accounts cannot sign in</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">✅ Solution</h2>
          <ol className="list-decimal pl-5 text-sm space-y-1">
            <li>Go to Supabase Dashboard: <a href="https://supabase.com/dashboard/project/bubtmfzfyocxvwkxrpqb/auth/providers" target="_blank" className="text-blue-600 underline">Open Supabase Auth Settings</a></li>
            <li>Click on "Email" provider</li>
            <li>Find "Enable email confirmations" and <strong>DISABLE</strong> it</li>
            <li>Save changes</li>
            <li>Delete your existing user in Authentication → Users</li>
            <li>Sign up again at <a href="/auth/signup" className="text-blue-600 underline">/auth/signup</a></li>
            <li>Try signing in</li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Check User Status</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <button
              onClick={checkUser}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Check User Status
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-6">
          <h2 className="font-semibold mb-2">🔴 Common Issue: Email Confirmation</h2>
          <p className="text-sm mb-2">
            When you see "Invalid credentials" but you just created an account:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Account was created successfully</li>
            <li>But it's in "pending confirmation" state</li>
            <li>Supabase won't let you sign in until email is confirmed</li>
            <li>You need to either:
              <ul className="list-circle pl-5 mt-1">
                <li>Disable email confirmation in Supabase (recommended for dev)</li>
                <li>Or check your email for confirmation link</li>
                <li>Or manually confirm the user in Supabase Dashboard</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="mt-6 space-x-4">
          <a
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Sign In
          </a>
          <a
            href="https://supabase.com/dashboard/project/bubtmfzfyocxvwkxrpqb/auth/users"
            target="_blank"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Open Supabase Users →
          </a>
        </div>
      </div>
    </div>
  );
}
