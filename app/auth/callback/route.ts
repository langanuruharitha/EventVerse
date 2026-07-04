import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  console.log('Auth Callback - Code received:', code ? 'YES' : 'NO');

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
      return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(error.message)}`);
    }
    
    if (data?.session && data?.user) {
      console.log('User authenticated:', data.user.email);
      
      // Log user login for admin tracking
      try {
        await supabase.rpc('log_user_login');
      } catch (loginError) {
        console.error('Failed to log user login:', loginError);
        // Don't block the login if tracking fails
      }
      
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  console.error('Auth callback failed - redirecting to signin');
  return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`);
}
