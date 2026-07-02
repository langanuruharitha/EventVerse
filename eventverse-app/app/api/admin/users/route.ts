// API Route: Admin User Management
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET: Fetch users
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    let query = supabase
      .from('users')
      .select('id, email, full_name, role, created_at, last_sign_in_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      users: users || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error: any) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST: Perform admin action on user
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, reason, duration } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    // Log admin action
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: `admin_${action}`,
      details: { reason, duration },
      admin_user_id: adminUser.id,
      category: 'user_action',
      severity: 'warning'
    });

    // Perform action based on type
    switch (action) {
      case 'suspend':
        // In production, implement actual suspension logic
        console.log(`User ${userId} suspended for ${duration}`);
        break;
      case 'ban':
        console.log(`User ${userId} banned permanently`);
        break;
      case 'verify':
        await supabase
          .from('users')
          .update({ role: 'verified' })
          .eq('id', userId);
        break;
      case 'warn':
        // Send warning notification
        console.log(`User ${userId} warned: ${reason}`);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform admin action' },
      { status: 500 }
    );
  }
}
