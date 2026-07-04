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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  const { vendorId } = await params;
  try {
    const supabase = await createServerClient();
    const admin = await checkAdminAuth(supabase);

    // Get request body
    const body = await request.json();
    const { approved, reason } = body;

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Approved status is required' },
        { status: 400 }
      );
    }

    // Verify vendor
    const adminService = new AdminService();
    const vendor = await adminService.verifyVendor(
      vendorId,
      admin.id,
      approved,
      reason
    );

    return NextResponse.json({
      message: approved ? 'Vendor verified successfully' : 'Vendor rejected',
      vendor,
    });
  } catch (error: any) {
    console.error('Verify vendor error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
