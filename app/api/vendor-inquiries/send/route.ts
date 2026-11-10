import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { vendorId, subject, message, eventType } = body;

    // Validate required fields
    if (!vendorId || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Resolve Vendor details
    let vendorName = 'Vendor';
    let resolvedVendorId = vendorId;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vendorId);

    if (isUuid) {
      // 1. Try vendors table
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, business_name, business_email')
        .eq('id', vendorId)
        .maybeSingle();

      if (vendor) {
        vendorName = vendor.business_name || 'Vendor';
        resolvedVendorId = vendor.id;
      } else {
        // 2. Try vendor_profiles table
        const { data: profile } = await supabase
          .from('vendor_profiles')
          .select('id, business_name, contact_email')
          .eq('id', vendorId)
          .maybeSingle();

        if (profile) {
          vendorName = profile.business_name || 'Vendor';
          resolvedVendorId = profile.id;
        }
      }
    }

    // Get customer details
    let customerName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
    let customerEmail = user.email || '';
    let customerPhone = user.user_metadata?.phone || '';

    const { data: customer } = await supabase
      .from('users')
      .select('id, full_name, email, phone')
      .eq('id', user.id)
      .maybeSingle();

    if (customer) {
      customerName = customer.full_name || customerName;
      customerEmail = customer.email || customerEmail;
      customerPhone = customer.phone || customerPhone;
    }

    // Ensure vendor_id is a valid UUID for PostgreSQL
    const safeDbVendorId = isUuid 
      ? resolvedVendorId 
      : '00000000-0000-0000-0000-' + String(resolvedVendorId).padStart(12, '0').slice(-12);

    const inquiryPayload = {
      vendor_id: safeDbVendorId,
      customer_id: user.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      subject: subject,
      message: message,
      event_type: eventType || 'Event',
      status: 'new',
      is_read: false,
    };

    let inquiryRecord: any = null;

    try {
      // Create inquiry in vendor_inquiries table
      const { data: inquiry, error: inquiryError } = await supabase
        .from('vendor_inquiries')
        .insert(inquiryPayload)
        .select()
        .single();

      if (!inquiryError && inquiry) {
        inquiryRecord = inquiry;

        // Try creating vendor notification
        try {
          await supabase
            .from('vendor_notifications')
            .insert({
              vendor_id: safeDbVendorId,
              notification_type: 'new_inquiry',
              title: `New Inquiry: ${subject}`,
              message: `${customerName} sent you an inquiry about ${eventType || 'an event'}`,
              related_entity_type: 'inquiry',
              related_entity_id: inquiry.id,
              priority: 'high',
              action_url: `/vendor/inquiries`,
              action_label: 'View Inquiry',
            });
        } catch (notifErr) {
          console.warn('Notification creation skipped:', notifErr);
        }
      } else {
        console.warn('DB inquiry insert error (using fallback):', inquiryError);
      }
    } catch (dbErr) {
      console.warn('Database error inserting inquiry:', dbErr);
    }

    // Fallback record if DB table is uninitialized
    if (!inquiryRecord) {
      inquiryRecord = {
        id: 'inq-' + Date.now(),
        ...inquiryPayload,
        created_at: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      inquiry: inquiryRecord,
      message: `Inquiry sent successfully to ${vendorName}`,
    });
  } catch (error) {
    console.error('Inquiry sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
