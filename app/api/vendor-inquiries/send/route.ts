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

    // Get vendor details
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, business_name, business_email')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Get customer details
    const { data: customer, error: customerError } = await supabase
      .from('users')
      .select('id, full_name, email, phone')
      .eq('id', user.id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create inquiry in vendor_inquiries table
    const { data: inquiry, error: inquiryError } = await supabase
      .from('vendor_inquiries')
      .insert({
        vendor_id: vendorId,
        customer_id: user.id,
        customer_name: customer.full_name || 'Customer',
        customer_email: customer.email,
        customer_phone: customer.phone,
        subject: subject,
        message: message,
        event_type: eventType,
        status: 'new',
        is_read: false,
      })
      .select()
      .single();

    if (inquiryError) {
      console.error('Inquiry creation error:', inquiryError);
      return NextResponse.json(
        { error: 'Failed to send inquiry', details: inquiryError.message },
        { status: 500 }
      );
    }

    // Create notification for vendor
    await supabase
      .from('vendor_notifications')
      .insert({
        vendor_id: vendorId,
        notification_type: 'new_inquiry',
        title: `New Inquiry: ${subject}`,
        message: `${customer.full_name || 'A customer'} sent you an inquiry about ${eventType || 'an event'}`,
        related_entity_type: 'inquiry',
        related_entity_id: inquiry.id,
        priority: 'high',
        action_url: `/vendor/inquiries/${inquiry.id}`,
        action_label: 'View Inquiry',
      });

    return NextResponse.json({
      success: true,
      inquiry,
      message: 'Inquiry sent successfully',
    });
  } catch (error) {
    console.error('Inquiry sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
