import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const type = requestUrl.searchParams.get('type');

  console.log('Auth Callback - Code received:', code ? 'YES' : 'NO', 'Type:', type);

  if (code) {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log('Exchange code result:', { 
      hasSession: !!data?.session, 
      hasUser: !!data?.user,
      error: error?.message 
    });
    
    if (error) {
      console.error('Auth callback error:', error);
      // If email confirmation, redirect to confirm page with error
      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/auth/confirm?confirmed=false&error=${encodeURIComponent(error.message)}`);
      }
      return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(error.message)}`);
    }
    
    if (data?.session && data?.user) {
      console.log('User authenticated:', data.user.email);
      
      // If this is an email confirmation (signup), redirect to confirmation page
      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/auth/confirm?confirmed=true`);
      }
      
      // Otherwise redirect to dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  console.error('Auth callback failed - redirecting to signin');
  return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`);
}
