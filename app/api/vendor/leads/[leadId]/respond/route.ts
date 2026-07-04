import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { VendorService } from '@/lib/vendor/vendor-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;
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
    const { action, response, proposedPrice, rejectionReason } = body;

    if (!action || !response) {
      return NextResponse.json(
        { error: 'Action and response are required' },
        { status: 400 }
      );
    }

    // Respond to lead
    const result = await vendorService.respondToLead(leadId, vendor.id, {
      action,
      response,
      proposedPrice,
      rejectionReason,
    });

    return NextResponse.json({
      message: 'Response submitted successfully',
      lead: result,
    });
  } catch (error: any) {
    console.error('Respond to lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
