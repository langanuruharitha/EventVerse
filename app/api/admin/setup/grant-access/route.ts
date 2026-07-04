import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Check if user already has admin access
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      if (!existingAdmin.is_active) {
        // Reactivate admin account
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('email', email);

        if (updateError) throw updateError;

        return NextResponse.json({
          message: `Admin account reactivated for ${email}`,
          email,
          role: existingAdmin.role,
        });
      }

      return NextResponse.json(
        { error: `${email} already has admin access (role: ${existingAdmin.role})` },
        { status: 400 }
      );
    }

    // Try to grant admin access using RPC function
    const { data, error } = await supabase.rpc('grant_admin_access', {
      user_email: email,
      admin_role: 'super_admin'
    });

    if (error) {
      console.error('RPC error:', error);
      
      // Fallback: Direct insert (requires user to exist in auth.users)
      // Get user from auth.users - we can't query auth.users directly from client
      // So we'll use a service role key or have them run SQL
      
      return NextResponse.json(
        { 
          error: 'Could not grant admin access automatically.',
          solution: 'Please run the SQL file: lib/supabase/ADMIN-ACCESS-FIX.sql',
          details: error.message || 'User might not exist. Sign up at /auth/signup first, then try again.'
        },
        { status: 500 }
      );
    }

    // Check the result
    const result = data as any;
    if (result && !result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to grant admin access' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `✅ Admin access granted successfully to ${email}! They can now login at /admin/login`,
      email,
      role: 'super_admin',
    });
  } catch (error: any) {
    console.error('Grant admin access error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        solution: 'Run SQL file: lib/supabase/ADMIN-ACCESS-FIX.sql in Supabase SQL Editor'
      },
      { status: 500 }
    );
  }
}
