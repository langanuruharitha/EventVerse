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
    const {
      vendorId,
      eventId,
      eventType,
      eventName,
      eventDate,
      eventLocation,
      eventVenue,
      guestCount,
      serviceCategory,
      serviceDetails,
      specificRequirements,
      budgetMin,
      budgetMax,
      budgetFlexible,
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    // Validate required fields
    if (!vendorId || !serviceCategory || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get vendor details
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, business_name, business_email, user_id')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Create the lead
    const { data: lead, error: leadError } = await supabase
      .from('vendor_leads')
      .insert({
        customer_id: user.id,
        vendor_id: vendorId,
        event_id: eventId,
        event_type: eventType,
        event_name: eventName,
        event_date: eventDate,
        event_location: eventLocation,
        event_venue: eventVenue,
        guest_count: guestCount,
        service_category: serviceCategory,
        service_details: serviceDetails,
        specific_requirements: specificRequirements,
        budget_min: budgetMin,
        budget_max: budgetMax,
        budget_flexible: budgetFlexible !== false,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        lead_status: 'new',
        priority: 'medium',
        email_sent: false,
      })
      .select()
      .single();

    if (leadError) {
      console.error('Lead creation error:', leadError);
      return NextResponse.json(
        { error: 'Failed to create lead', details: leadError.message },
        { status: 500 }
      );
    }

    // Create notification for vendor
    await supabase
      .from('vendor_notifications')
      .insert({
        vendor_id: vendorId,
        notification_type: 'new_lead',
        title: `New Lead: ${customerName} is interested in your ${serviceCategory} services`,
        message: `You have received a new ${serviceCategory} lead for ${eventType}. Budget: ₹${budgetMin?.toLocaleString('en-IN')} - ₹${budgetMax?.toLocaleString('en-IN')}`,
        related_entity_type: 'lead',
        related_entity_id: lead.id,
        priority: 'high',
        action_url: `/vendor/leads/${lead.id}`,
        action_label: 'View Lead',
      });

    // Send email to vendor (in background)
    // We'll create this endpoint next
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send-lead-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          vendorEmail: vendor.business_email,
          vendorBusinessName: vendor.business_name,
          customerName,
          customerEmail,
          customerPhone,
          eventType,
          eventName,
          eventDate,
          eventLocation,
          guestCount,
          serviceCategory,
          serviceDetails,
          specificRequirements,
          budgetMin,
          budgetMax,
        }),
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    // Update lead to mark email as sent
    await supabase
      .from('vendor_leads')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', lead.id);

    return NextResponse.json({
      success: true,
      lead,
      message: 'Lead created successfully and vendor has been notified',
    });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
