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
    const eventCategory = searchParams.get('eventCategory') || undefined;
    const mediaType = searchParams.get('mediaType') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');

    // Get portfolio
    const result = await vendorService.getPortfolio(vendor.id, {
      eventCategory,
      mediaType,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Get portfolio error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Get request body
    const body = await request.json();
    const {
      mediaType,
      mediaUrl,
      thumbnailUrl,
      title,
      description,
      eventCategory,
      serviceCategory,
      tags,
    } = body;

    if (!mediaType || !mediaUrl || !eventCategory) {
      return NextResponse.json(
        { error: 'Media type, URL, and event category are required' },
        { status: 400 }
      );
    }

    // Upload portfolio item
    const result = await vendorService.uploadPortfolioItem(vendor.id, {
      mediaType,
      mediaUrl,
      thumbnailUrl,
      title,
      description,
      eventCategory,
      serviceCategory,
      tags,
    });

    return NextResponse.json({
      message: 'Portfolio item uploaded successfully',
      item: result,
    });
  } catch (error: any) {
    console.error('Upload portfolio error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
