import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/admin/admin-service';

async function checkAdminAuth(supabase: any) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (adminError || !admin || !admin.is_active) {
    throw new Error('Unauthorized');
  }

  return admin;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    await checkAdminAuth(supabase);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const assignedTo = searchParams.get('assignedTo') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get tickets
    const adminService = new AdminService();
    const result = await adminService.getTickets({
      status,
      priority,
      assignedTo,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
