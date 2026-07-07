import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize Resend (it will throw an error later if key is missing and we try to use it)
const resend = new Resend(process.env.RESEND_API_KEY || 'missing');

// Initialize Twilio
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sendVia, senderName, eventName } = body;

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get guest
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*, events(event_name, event_date)')
      .eq('id', id)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const rsvpLink = `${siteUrl}/rsvp/${guest.id}`;

    let emailSent = false;
    let whatsappSent = false;
    let errors: string[] = [];

    // Send Email
    if ((sendVia === 'both' || sendVia === 'email') && guest.email) {
      if (process.env.RESEND_API_KEY) {
        try {
          const resendResult = await resend.emails.send({
            from: 'EventVerse <onboarding@resend.dev>', // Free testing domain
            to: [guest.email],
            subject: `You're invited to ${eventName}!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Hi ${guest.guest_name},</h2>
                <p>You are warmly invited to <strong>${eventName}</strong>!</p>
                <p>From: ${senderName || 'Your Host'}</p>
                <div style="margin: 30px 0;">
                  <a href="${rsvpLink}" style="background-color: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Click here to RSVP
                  </a>
                </div>
                <p>We hope to see you there!</p>
              </div>
            `
          });
          if (resendResult.error) {
             errors.push(`Resend API Error: ${resendResult.error.message}`);
          } else {
             emailSent = true;
          }
        } catch (error: any) {
          console.error('Failed to send Resend email:', error);
          errors.push(`Email Crash: ${error.message || 'Unknown error'}`);
        }
      } else {
        console.warn('RESEND_API_KEY is missing. Simulating email sending.');
        emailSent = true;
      }
    }

    // Send WhatsApp via Twilio
    if ((sendVia === 'both' || sendVia === 'whatsapp') && guest.phone) {
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        try {
          // Format phone number to E.164 format if it's not already
          let formattedPhone = guest.phone.replace(/\D/g, '');
          if (!formattedPhone.startsWith('+')) {
             // Assuming Indian number +91 if no country code provided and length is 10
             if (formattedPhone.length === 10) formattedPhone = '+91' + formattedPhone;
             else formattedPhone = '+' + formattedPhone;
          }

          const messageBody = `Hi ${guest.guest_name},\n\nYou are invited to *${eventName}*!\n\nFrom,\n${senderName || 'Your Host'}\n\nPlease click here to confirm your RSVP:\n${rsvpLink}`;

          await twilioClient.messages.create({
            body: messageBody,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`
          });
          whatsappSent = true;
        } catch (error: any) {
          console.error('Failed to send Twilio WhatsApp:', error);
          errors.push(`WhatsApp Error: ${error.message || 'Unknown Twilio error'}`);
        }
      } else {
        console.warn('Twilio credentials missing. Simulating WhatsApp sending.');
        whatsappSent = true;
      }
    }

    // Update guest invitation status
    await supabase
      .from('guests')
      .update({ invitation_sent: true })
      .eq('id', id);

    return NextResponse.json({ 
      success: errors.length === 0, 
      emailSent, 
      whatsappSent,
      simulated: !process.env.RESEND_API_KEY && !process.env.TWILIO_ACCOUNT_SID
    });

  } catch (error: any) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
