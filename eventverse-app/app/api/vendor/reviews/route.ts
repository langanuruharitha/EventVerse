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
    const rating = searchParams.get('rating')
      ? parseInt(searchParams.get('rating')!)
      : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get reviews
    const result = await vendorService.getReviews(vendor.id, {
      rating,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
