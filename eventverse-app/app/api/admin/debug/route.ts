import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const checks: any = {};
    let authTest: any = null;

    // Check 1: Does user exist in auth.users?
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    const user = users?.users.find((u: any) => u.email === email);
    
    if (!user) {
      checks.userExists = {
        passed: false,
        message: 'User does not exist in auth.users table',
      };
    } else {
      checks.userExists = {
        passed: true,
        message: 'User found in auth.users',
        details: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
      };

      // Check 2: Is email confirmed?
      checks.emailConfirmed = {
        passed: !!user.email_confirmed_at,
        message: user.email_confirmed_at
          ? `Email confirmed at ${user.email_confirmed_at}`
          : 'Email NOT confirmed',
        details: {
          email_confirmed_at: user.email_confirmed_at,
          confirmation_sent_at: user.confirmation_sent_at,
        },
      };

      // Check 3: Does admin profile exist?
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (adminError || !admin) {
        checks.adminProfile = {
          passed: false,
          message: 'Admin profile NOT found in admin_users table',
          details: adminError,
        };
      } else {
        checks.adminProfile = {
          passed: true,
          message: 'Admin profile found',
          details: {
            id: admin.id,
            role: admin.role,
            is_active: admin.is_active,
            email: admin.email,
            full_name: admin.full_name,
          },
        };

        // Check 4: Is admin active?
        checks.adminActive = {
          passed: admin.is_active,
          message: admin.is_active ? 'Admin account is ACTIVE' : 'Admin account is INACTIVE',
        };
      }

      // Check 5: Test authentication if password provided
      if (password) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          checks.authentication = {
            passed: false,
            message: 'Authentication FAILED',
            details: {
              error: authError.message,
              status: authError.status,
            },
          };
          authTest = {
            success: false,
            error: authError.message,
          };
        } else {
          checks.authentication = {
            passed: true,
            message: 'Authentication SUCCESSFUL',
          };
          authTest = {
            success: true,
            session: {
              access_token: authData.session?.access_token ? '✓ Present' : '✗ Missing',
              refresh_token: authData.session?.refresh_token ? '✓ Present' : '✗ Missing',
              expires_at: authData.session?.expires_at,
            },
          };
        }
      } else {
        checks.authentication = {
          passed: null,
          message: 'Authentication test skipped (no password provided)',
        };
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        admin: admin || null,
        authTest,
        checks,
      });
    }

    // If user doesn't exist, return early
    return NextResponse.json({
      success: false,
      user: null,
      admin: null,
      authTest: null,
      checks,
      message: 'User not found. Create user in Supabase Dashboard first.',
    }, { status: 404 });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || 'Internal server error',
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
