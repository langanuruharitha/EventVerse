'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<any>({
    loading: true,
    supabase: null,
    auth: null,
    database: null,
    error: null
  });

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createBrowserClient();
        
        // Test 1: Supabase client created
        setStatus((prev: any) => ({ ...prev, supabase: 'OK' }));

        // Test 2: Auth connection
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
          setStatus((prev: any) => ({ ...prev, auth: `Error: ${authError.message}` }));
        } else {
          setStatus((prev: any) => ({ 
            ...prev, 
            auth: authData.session ? `Logged in as ${authData.session.user.email}` : 'Not logged in' 
          }));
        }

        // Test 3: Database connection
        const { data: dbData, error: dbError } = await supabase
          .from('events')
          .select('count')
          .limit(1);
        
        if (dbError) {
          setStatus((prev: any) => ({ ...prev, database: `Error: ${dbError.message}` }));
        } else {
          setStatus((prev: any) => ({ ...prev, database: 'OK - Can query database' }));
        }

        setStatus((prev: any) => ({ ...prev, loading: false }));

      } catch (error: any) {
        setStatus({
          loading: false,
          supabase: null,
          auth: null,
          database: null,
          error: error.message || 'Unknown error'
        });
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 EventVerse Connection Test</h1>

        {status.loading ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Testing connections...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Supabase Client */}
            <div className={`p-6 rounded-lg shadow ${status.supabase === 'OK' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <h2 className="text-xl font-semibold mb-2">
                {status.supabase === 'OK' ? '✅' : '❌'} Supabase Client
              </h2>
              <p className="text-gray-700">{status.supabase || 'Failed to create'}</p>
            </div>

            {/* Auth */}
            <div className={`p-6 rounded-lg shadow ${status.auth?.includes('Error') ? 'bg-red-50 border-2 border-red-200' : 'bg-blue-50 border-2 border-blue-200'}`}>
              <h2 className="text-xl font-semibold mb-2">
                {status.auth?.includes('Error') ? '❌' : '✅'} Authentication
              </h2>
              <p className="text-gray-700">{status.auth || 'Unknown'}</p>
            </div>

            {/* Database */}
            <div className={`p-6 rounded-lg shadow ${status.database?.includes('Error') ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
              <h2 className="text-xl font-semibold mb-2">
                {status.database?.includes('Error') ? '❌' : '✅'} Database Connection
              </h2>
              <p className="text-gray-700">{status.database || 'Unknown'}</p>
            </div>

            {/* Error */}
            {status.error && (
              <div className="p-6 rounded-lg shadow bg-red-50 border-2 border-red-200">
                <h2 className="text-xl font-semibold mb-2">❌ General Error</h2>
                <p className="text-red-700 font-mono text-sm">{status.error}</p>
              </div>
            )}

            {/* Environment Check */}
            <div className="p-6 rounded-lg shadow bg-gray-50 border-2 border-gray-200">
              <h2 className="text-xl font-semibold mb-2">🔧 Environment Variables</h2>
              <div className="space-y-2 text-sm font-mono">
                <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
                <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 rounded-lg shadow bg-white">
              <h2 className="text-xl font-semibold mb-4">📋 Next Steps</h2>
              <div className="space-y-2 text-sm">
                {!status.auth?.includes('Logged in') && (
                  <p>• You need to sign in: <a href="/auth/signin" className="text-blue-600 underline">Go to Sign In</a></p>
                )}
                {status.database?.includes('Error') && (
                  <p>• Database connection failed. Check if you ran the SQL migrations in Supabase.</p>
                )}
                {status.supabase !== 'OK' && (
                  <p>• Supabase client failed to initialize. Check your .env.local file.</p>
                )}
                <p>• Go back to: <a href="/" className="text-blue-600 underline">Home</a> | <a href="/dashboard" className="text-blue-600 underline">Dashboard</a></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
