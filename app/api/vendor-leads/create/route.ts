import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { vendorId, vendorName, vendorCategory, eventId, eventType, eventName, eventDate, eventLocation, eventVenue, guestCount, serviceCategory, serviceDetails, specificRequirements, budgetMin, budgetMax, budgetFlexible, customerName, customerEmail, customerPhone } = body;
    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    let vendorDbId = null;
    if (vendorId) {
      const { data: vendor } = await supabase.from("vendors").select("id").eq("id", vendorId).single();
      if (vendor) vendorDbId = vendor.id;
    }
    const { data: lead, error: leadError } = await supabase
      .from("vendor_leads")
      .insert({
        customer_id: user.id, vendor_id: vendorDbId, event_id: eventId || null,
        event_type: eventType, event_name: eventName, event_date: eventDate || null,
        event_location: eventLocation, event_venue: eventVenue, guest_count: guestCount,
        service_category: serviceCategory || vendorCategory, service_details: serviceDetails,
        specific_requirements: specificRequirements, budget_min: budgetMin, budget_max: budgetMax,
        budget_flexible: budgetFlexible !== false, customer_name: customerName,
        customer_email: customerEmail, customer_phone: customerPhone,
        lead_status: "new", priority: "medium", email_sent: false,
      })
      .select().single();
    if (leadError) {
      console.error("Lead creation error details:", leadError);
      return NextResponse.json({ error: `Failed to save enquiry: ${leadError.message} (code: ${leadError.code})` }, { status: 500 });
    }
    if (vendorDbId && lead) {
      try {
        await supabase.from("vendor_notifications").insert({
          vendor_id: vendorDbId, notification_type: "new_lead",
          title: `New Enquiry from ${customerName}`, message: `Budget: Rs.${budgetMin} - Rs.${budgetMax}`,
          related_entity_type: "lead", related_entity_id: lead.id, priority: "high",
          action_url: `/vendor/leads/${lead.id}`, action_label: "View Enquiry",
        });
      } catch (err) {
        console.error("Failed to insert vendor notification:", err);
      }
    }
    return NextResponse.json({ success: true, lead: lead || null, message: `Enquiry sent! ${vendorName || "The vendor"} will respond within 24-48 hours.` });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
