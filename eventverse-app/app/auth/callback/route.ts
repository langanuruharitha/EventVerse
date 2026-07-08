import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') ?? '/';
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  console.log('Auth Callback - Code:', code ? 'YES' : 'NO', 'Error:', error);

  // Handle error from Supabase
  if (error) {
    console.error('Supabase error:', error, error_description);
    return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(error_description || error)}`);
  }

  if (code) {
    const supabase = await createServerClient();
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Exchange code result:', { 
        hasSession: !!data?.session, 
        hasUser: !!data?.user,
        error: error?.message 
      });
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${origin}/auth/confirm?confirmed=false&error=${encodeURIComponent(error.message)}`);
      }
      
      if (data?.session && data?.user) {
        console.log('User authenticated:', data.user.email);
        
        // Check if this is a new signup (email not confirmed before)
        const emailConfirmed = data.user.email_confirmed_at;
        const isNewConfirmation = emailConfirmed && new Date(emailConfirmed).getTime() > Date.now() - 60000; // Within last minute
        
        // If just confirmed email, show confirmation page
        if (isNewConfirmation) {
          return NextResponse.redirect(`${origin}/auth/confirm?confirmed=true&email=${encodeURIComponent(data.user.email || '')}`);
        }
        
        // Otherwise redirect to dashboard or specified next URL
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (err) {
      console.error('Unexpected error in callback:', err);
      return NextResponse.redirect(`${origin}/auth/signin?error=unexpected_error`);
    }
  }

  console.error('Auth callback failed - no code');
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code_provided`);
}
