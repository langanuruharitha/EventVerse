'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Check if user just confirmed email
    const params = new URLSearchParams(window.location.search);
    const confirmed = params.get('confirmed');
    const error = params.get('error');

    if (error) {
      setStatus('error');
    } else if (confirmed === 'true') {
      setStatus('success');
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/auth/signin');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setStatus('error');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <img 
              src="/eventverse-logo.png" 
              alt="EventVerse" 
              className="h-20 w-auto mx-auto"
            />
          </div>

          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirming Your Email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8">
              <div className="mb-6">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Email Confirmed! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  Redirecting to sign in page in {countdown} seconds...
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Sign In Now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8">
              <div className="mb-6">
                <XCircle className="w-20 h-20 text-red-500 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't verify your email. The link may have expired or is invalid.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  Please try signing up again or contact support if the problem persists.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/auth/signup"
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  Sign Up Again
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-block w-full px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@eventverse.com" className="text-purple-600 hover:underline font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
