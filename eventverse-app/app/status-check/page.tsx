'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface StatusCheck {
  name: string;
  status: 'checking' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function StatusCheckPage() {
  const [checks, setChecks] = useState<StatusCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runAllChecks();
  }, []);

  async function runAllChecks() {
    const results: StatusCheck[] = [];

    // 1. Check Authentication
    results.push({ name: 'Authentication', status: 'checking', message: 'Checking...' });
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        results[0] = {
          name: 'Authentication',
          status: 'success',
          message: `✅ Signed in as: ${user.email}`,
          details: `User ID: ${user.id}`
        };
      } else {
        results[0] = {
          name: 'Authentication',
          status: 'error',
          message: '❌ Not signed in',
          details: 'You need to sign in at /auth/signin'
        };
      }
    } catch (err) {
      results[0] = {
        name: 'Authentication',
        status: 'error',
        message: '❌ Auth error',
        details: err instanceof Error ? err.message : 'Unknown error'
      };
    }

    // 2. Check event_types table
    results.push({ name: 'Database: event_types', status: 'checking', message: 'Checking...' });
    try {
      const { data, error } = await supabase.from('event_types').select('*').limit(1);
      if (error) throw error;
      results[1] = {
        name: 'Database: event_types',
        status: 'success',
        message: '✅ Table exists and is accessible',
        details: `Found ${data?.length || 0} sample rows`
      };
    } catch (err: any) {
      results[1] = {
        name: 'Database: event_types',
        status: 'error',
        message: '❌ Table missing or error',
        details: err.message || 'Run phase-02-schema.sql in Supabase'
      };
    }

    // 3. Check events table
    results.push({ name: 'Database: events', status: 'checking', message: 'Checking...' });
    try {
      const { data, error } = await supabase.from('events').select('count').limit(1);
      if (error) throw error;
      results[2] = {
        name: 'Database: events',
        status: 'success',
        message: '✅ Table exists and is accessible'
      };
    } catch (err: any) {
      results[2] = {
        name: 'Database: events',
        status: 'error',
        message: '❌ Table missing or error',
        details: err.message || 'Run phase-02-schema.sql in Supabase'
      };
    }

    // 4. Check event_tasks table
    results.push({ name: 'Database: event_tasks', status: 'checking', message: 'Checking...' });
    try {
      const { error } = await supabase.from('event_tasks').select('count').limit(1);
      if (error) throw error;
      results[3] = {
        name: 'Database: event_tasks',
        status: 'success',
        message: '✅ Table exists'
      };
    } catch (err: any) {
      results[3] = {
        name: 'Database: event_tasks',
        status: 'error',
        message: '❌ Table missing',
        details: 'Run phase-02-schema.sql'
      };
    }

    // 5. Check AI key
    results.push({ name: 'AI Configuration', status: 'checking', message: 'Checking...' });
    const hasGeminiKey = (process.env.NEXT_PUBLIC_GEMINI_API_KEY?.length ?? 0) > 0;
    results[4] = {
      name: 'AI Configuration',
      status: hasGeminiKey ? 'success' : 'warning',
      message: hasGeminiKey ? '✅ Gemini API key configured' : '⚠️ Gemini API key missing',
      details: hasGeminiKey ? 'AI features will work' : 'Add GEMINI_API_KEY to .env.local'
    };

    // 6. Check Supabase connection
    results.push({ name: 'Supabase Connection', status: 'checking', message: 'Checking...' });
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      results[5] = {
        name: 'Supabase Connection',
        status: 'success',
        message: '✅ Connected to Supabase'
      };
    } catch (err: any) {
      results[5] = {
        name: 'Supabase Connection',
        status: 'error',
        message: '❌ Connection error',
        details: err.message
      };
    }

    setChecks(results);
    setLoading(false);
  }

  const allSuccess = checks.every(c => c.status === 'success');
  const hasErrors = checks.some(c => c.status === 'error');
  const hasWarnings = checks.some(c => c.status === 'warning');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔍 System Status Check
          </h1>
          <p className="text-gray-600">
            Comprehensive diagnosis of your EventVerse application
          </p>
        </div>

        {/* Overall Status */}
        {!loading && (
          <div className={`rounded-xl p-6 mb-6 ${
            allSuccess ? 'bg-green-100 border-2 border-green-300' :
            hasErrors ? 'bg-red-100 border-2 border-red-300' :
            'bg-yellow-100 border-2 border-yellow-300'
          }`}>
            <div className="text-center">
              <div className="text-6xl mb-3">
                {allSuccess ? '🎉' : hasErrors ? '❌' : '⚠️'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {allSuccess ? 'Everything is Working!' :
                 hasErrors ? 'Some Issues Found' :
                 'Warnings Detected'}
              </h2>
              <p className="text-gray-700">
                {allSuccess ? 'Your application is fully operational.' :
                 hasErrors ? 'Please fix the errors below to continue.' :
                 'Some features may not work as expected.'}
              </p>
            </div>
          </div>
        )}

        {/* Status Checks */}
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                check.status === 'success' ? 'border-green-500' :
                check.status === 'error' ? 'border-red-500' :
                check.status === 'warning' ? 'border-yellow-500' :
                'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {check.name}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    check.status === 'success' ? 'text-green-700' :
                    check.status === 'error' ? 'text-red-700' :
                    check.status === 'warning' ? 'text-yellow-700' :
                    'text-gray-600'
                  }`}>
                    {check.message}
                  </p>
                  {check.details && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {check.details}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {check.status === 'checking' && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                  )}
                  {check.status === 'success' && (
                    <div className="text-3xl">✅</div>
                  )}
                  {check.status === 'error' && (
                    <div className="text-3xl">❌</div>
                  )}
                  {check.status === 'warning' && (
                    <div className="text-3xl">⚠️</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {!loading && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">🚀 What to Do Next</h2>
            
            <div className="space-y-3">
              {/* If not authenticated */}
              {checks[0]?.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-900 mb-2">❌ Not Signed In</p>
                  <p className="text-sm text-red-700 mb-3">
                    You need to sign in to use the application.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="/auth/signin"
                      className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700"
                    >
                      → Sign In Now
                    </a>
                    <a
                      href="/auth/signup"
                      className="block w-full px-4 py-2 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700"
                    >
                      → Create New Account
                    </a>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Tip:</strong> If you get "Invalid credentials" error, email confirmation 
                      might be enabled. See DASHBOARD_FIX_STEPS.md for instructions to disable it.
                    </p>
                  </div>
                </div>
              )}

              {/* If database tables missing */}
              {(checks[1]?.status === 'error' || checks[2]?.status === 'error') && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-semibold text-orange-900 mb-2">❌ Database Schema Not Applied</p>
                  <p className="text-sm text-orange-700 mb-3">
                    Phase 02 database tables are missing. You need to run the SQL schema in Supabase.
                  </p>
                  <ol className="text-sm text-orange-800 space-y-2 mb-3">
                    <li>1. Open: <a href="https://supabase.com/dashboard/project/bubtmfzfyocxvwkxrpqb/sql/new" target="_blank" className="underline">Supabase SQL Editor</a></li>
                    <li>2. Open file: <code className="bg-orange-100 px-1 rounded">lib\supabase\phase-02-schema.sql</code></li>
                    <li>3. Copy ALL the SQL code</li>
                    <li>4. Paste in Supabase and click RUN</li>
                    <li>5. Come back here and click "Recheck"</li>
                  </ol>
                  <p className="text-xs text-orange-700">
                    📄 See START_HERE.md for detailed instructions
                  </p>
                </div>
              )}

              {/* If everything is good */}
              {allSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-900 mb-2">🎉 All Systems Operational!</p>
                  <p className="text-sm text-green-700 mb-3">
                    Your application is ready to use. Start creating events!
                  </p>
                  <div className="space-y-2">
                    <a
                      href="/dashboard"
                      className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700"
                    >
                      → Go to Dashboard
                    </a>
                    <a
                      href="/events"
                      className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
                    >
                      → View Events
                    </a>
                    <a
                      href="/events/new"
                      className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700"
                    >
                      → Create New Event
                    </a>
                  </div>
                </div>
              )}

              {/* Recheck button */}
              <button
                onClick={() => {
                  setLoading(true);
                  setChecks([]);
                  runAllChecks();
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mt-4"
              >
                🔄 Recheck All Systems
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">📚 Documentation</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>DASHBOARD_FIX_STEPS.md</strong> - Fix authentication issues</li>
            <li>• <strong>START_HERE.md</strong> - Complete setup guide</li>
            <li>• <strong>TROUBLESHOOTING.md</strong> - Common problems and solutions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
