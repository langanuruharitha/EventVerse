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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    // Get notifications
    const notifications = await vendorService.getNotifications(vendor.id, unreadOnly);

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
