import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/admin/admin-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin profile
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 404 }
      );
    }

    if (!admin.is_active) {
      return NextResponse.json(
        { error: 'Admin account is inactive' },
        { status: 403 }
      );
    }

    // Get dashboard stats
    const adminService = new AdminService();
    const stats = await adminService.getDashboardStats();

    return NextResponse.json({
      admin,
      stats,
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
