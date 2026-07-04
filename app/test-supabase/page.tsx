'use client';

import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setError('');
    setResult(null);
    
    try {
      // Test 1: Check if Supabase client is initialized
      console.log('Supabase client:', supabase);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // Test 2: Try to get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', sessionData, sessionError);
      
      setResult({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasClient: !!supabase,
        session: sessionData,
        sessionError: sessionError?.message,
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <button
          onClick={testConnection}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
        >
          Test Supabase Connection
        </button>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">What to Check:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>hasClient:</strong> Should be true if Supabase is initialized</li>
            <li><strong>supabaseUrl:</strong> Should be your Supabase project URL</li>
            <li><strong>session:</strong> Will show current session if logged in</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
