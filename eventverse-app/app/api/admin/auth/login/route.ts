import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Admin login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = await createServerClient();
    
    if (!supabase) {
      console.error('Failed to create Supabase client');
      return NextResponse.json(
        { error: 'Failed to initialize authentication service' },
        { status: 500 }
      );
    }

    if (!supabase.auth) {
      console.error('Supabase client missing auth property');
      return NextResponse.json(
        { error: 'Authentication service not available' },
        { status: 500 }
      );
    }

    console.log('Attempting sign in...');

    // Sign in user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    console.log('Sign in successful, checking admin profile...');

    // Use service client to bypass RLS (session cookie not yet set in same request)
    const serviceClient = createServiceClient();

    // Get admin profile
    const { data: admin, error: adminError } = await serviceClient
      .from('admin_users')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (adminError || !admin) {
      console.error('Admin profile not found:', adminError);
      // Sign out the user since they're not an admin
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Admin profile not found. Please contact support.' },
        { status: 404 }
      );
    }

    if (!admin.is_active) {
      return NextResponse.json(
        { error: 'Admin account is inactive' },
        { status: 403 }
      );
    }

    console.log('Admin login successful:', admin.email);

    // Update last login (optional, don't fail if column doesn't exist)
    try {
      await supabase
        .from('admin_users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', admin.id);
    } catch (updateError) {
      console.warn('Failed to update last login:', updateError);
    }

    // Log activity (optional, don't fail if table doesn't exist)
    try {
      await supabase.from('admin_activity_logs').insert({
        admin_id: admin.id,
        action_type: 'login',
        target_type: 'admin',
        target_id: admin.id,
        description: 'Admin logged in',
      });
    } catch (logError) {
      console.warn('Failed to log activity:', logError);
    }

    const res = NextResponse.json({
      message: 'Login successful',
      admin,
      session: authData.session,
    });

    res.cookies.set('admin_authenticated', 'true', {
      path: '/',
      httpOnly: false, // Accessible to clientJS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
