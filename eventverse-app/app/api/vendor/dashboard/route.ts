import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { VendorService } from '@/lib/vendor/vendor-service';

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

    // Get vendor profile
    const vendorService = new VendorService();
    const vendor = await vendorService.getVendorByUserId(user.id);

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Get dashboard stats
    const stats = await vendorService.getDashboardStats(vendor.id);

    return NextResponse.json({
      vendor,
      stats,
    });
  } catch (error: any) {
    console.error('Vendor dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
