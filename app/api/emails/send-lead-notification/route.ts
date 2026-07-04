import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leadId,
      vendorEmail,
      vendorBusinessName,
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
    } = body;

    // Get email template
    const supabase = await createServerClient();
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_name', 'vendor_new_lead_notification')
      .eq('is_active', true)
      .single();

    if (!template) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }

    // Replace placeholders in template
    const vendorPortalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vendor/leads/${leadId}`;
    
    let emailBody = template.email_body
      .replace(/{{vendor_business_name}}/g, vendorBusinessName)
      .replace(/{{customer_name}}/g, customerName)
      .replace(/{{customer_email}}/g, customerEmail)
      .replace(/{{customer_phone}}/g, customerPhone || 'Not provided')
      .replace(/{{event_type}}/g, eventType)
      .replace(/{{event_name}}/g, eventName || 'Not specified')
      .replace(/{{event_date}}/g, eventDate || 'To be decided')
      .replace(/{{event_location}}/g, eventLocation || 'Not specified')
      .replace(/{{guest_count}}/g, guestCount?.toString() || 'Not specified')
      .replace(/{{service_category}}/g, serviceCategory)
      .replace(/{{service_details}}/g, serviceDetails || 'Not provided')
      .replace(/{{specific_requirements}}/g, specificRequirements || 'None specified')
      .replace(/{{budget_min}}/g, budgetMin?.toLocaleString('en-IN') || '0')
      .replace(/{{budget_max}}/g, budgetMax?.toLocaleString('en-IN') || 'Open')
      .replace(/{{vendor_portal_url}}/g, vendorPortalUrl);

    let subject = template.subject_line
      .replace(/{{customer_name}}/g, customerName)
      .replace(/{{service_category}}/g, serviceCategory);

    // For demo purposes, we'll simulate email sending
    // In production, integrate with Resend, SendGrid, or AWS SES
    console.log('='.repeat(80));
    console.log('📧 EMAIL NOTIFICATION TO VENDOR');
    console.log('='.repeat(80));
    console.log(`To: ${vendorEmail}`);
    console.log(`Subject: ${subject}`);
    console.log('-'.repeat(80));
    console.log(emailBody);
    console.log('='.repeat(80));

    // Log email in database
    await supabase.from('email_logs').insert({
      template_id: template.id,
      recipient_email: vendorEmail,
      recipient_name: vendorBusinessName,
      subject: subject,
      body: emailBody,
      related_entity_type: 'lead',
      related_entity_id: leadId,
      status: 'sent', // Change to 'pending' if using actual email service
      sent_at: new Date().toISOString(),
    });

    // Update template usage count
    await supabase
      .from('email_templates')
      .update({ times_sent: template.times_sent + 1 })
      .eq('id', template.id);

    /* 
    // PRODUCTION CODE: Integrate with actual email service
    // Example with Resend:
    
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'EventVerse <noreply@eventverse.com>',
      to: vendorEmail,
      subject: subject,
      html: emailBody.replace(/\n/g, '<br>'),
    });
    */

    // Also send confirmation email to customer
    const customerTemplate = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_name', 'customer_lead_confirmation')
      .eq('is_active', true)
      .single();

    if (customerTemplate.data) {
      const leadStatusUrl = `${process.env.NEXT_PUBLIC_APP_URL}/events/eventdetail/${eventLocation}/leads/${leadId}`;
      
      let customerEmailBody = customerTemplate.data.email_body
        .replace(/{{customer_name}}/g, customerName)
        .replace(/{{vendor_business_name}}/g, vendorBusinessName)
        .replace(/{{service_category}}/g, serviceCategory)
        .replace(/{{event_name}}/g, eventName || 'Your Event')
        .replace(/{{event_date}}/g, eventDate || 'To be decided')
        .replace(/{{budget_min}}/g, budgetMin?.toLocaleString('en-IN') || '0')
        .replace(/{{budget_max}}/g, budgetMax?.toLocaleString('en-IN') || 'Open')
        .replace(/{{lead_status_url}}/g, leadStatusUrl);

      let customerSubject = customerTemplate.data.subject_line
        .replace(/{{vendor_business_name}}/g, vendorBusinessName);

      console.log('\n' + '='.repeat(80));
      console.log('📧 CONFIRMATION EMAIL TO CUSTOMER');
      console.log('='.repeat(80));
      console.log(`To: ${customerEmail}`);
      console.log(`Subject: ${customerSubject}`);
      console.log('-'.repeat(80));
      console.log(customerEmailBody);
      console.log('='.repeat(80));

      // Log customer email
      await supabase.from('email_logs').insert({
        template_id: customerTemplate.data.id,
        recipient_email: customerEmail,
        recipient_name: customerName,
        subject: customerSubject,
        body: customerEmailBody,
        related_entity_type: 'lead',
        related_entity_id: leadId,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email notifications sent successfully',
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    );
  }
}
