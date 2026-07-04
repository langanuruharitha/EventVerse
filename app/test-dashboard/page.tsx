'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestDashboardPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Check session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Check user
      const { data: userData, error: userError } = await supabase.auth.getUser();

      setAuthState({
        session: sessionData.session,
        user: userData.user,
        sessionError: sessionError?.message,
        userError: userError?.message,
        hasSession: !!sessionData.session,
        hasUser: !!userData.user,
      });
    } catch (err) {
      setAuthState({
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Diagnostic</h1>

        {/* Auth Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Authentication Status</h2>
          
          {authState?.hasUser ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-900">✅ You are authenticated!</p>
                <p className="text-sm text-green-700 mt-1">Email: {authState.user.email}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">User Details:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(authState.user, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Session Info:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(authState.session, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-900">❌ Not authenticated</p>
              <p className="text-sm text-red-700 mt-1">You need to sign in first</p>
              {authState?.userError && (
                <p className="text-sm text-red-700 mt-2">Error: {authState.userError}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          
          <div className="space-y-3">
            {!authState?.hasUser ? (
              <>
                <a
                  href="/auth/signin"
                  className="block w-full px-6 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700"
                >
                  → Go to Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="block w-full px-6 py-3 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700"
                >
                  → Create New Account
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700"
                >
                  → Try Dashboard Again
                </a>
                <a
                  href="/events"
                  className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
                >
                  → Go to Events
                </a>
                <a
                  href="/events/new"
                  className="block w-full px-6 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700"
                >
                  → Create New Event
                </a>
              </>
            )}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-bold text-yellow-900 mb-3">🔧 Troubleshooting Tips</h2>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• If not authenticated: Sign in at <a href="/auth/signin" className="underline">/auth/signin</a></li>
            <li>• If email confirmation is enabled in Supabase, you need to confirm your email first</li>
            <li>• Try clearing your browser cookies and signing in again</li>
            <li>• Check if email confirmation is disabled in Supabase (see QUICK_FIX_LOGIN.md)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
