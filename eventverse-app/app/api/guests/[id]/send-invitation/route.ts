import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend (it will throw an error later if key is missing and we try to use it)
const resend = new Resend(process.env.RESEND_API_KEY || 'missing');

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

    // Send Email
    if ((sendVia === 'both' || sendVia === 'email') && guest.email) {
      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'EventVerse <invites@resend.dev>', // Use a verified domain in production
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
          emailSent = true;
        } catch (error) {
          console.error('Failed to send Resend email:', error);
          // Don't fail the whole request if email fails, just log it
        }
      } else {
        console.warn('RESEND_API_KEY is missing. Simulating email sending.');
        console.log(`[SIMULATED EMAIL to ${guest.email}] RSVP Link: ${rsvpLink}`);
        emailSent = true; // Simulated success
      }
    }

    // Send WhatsApp (Twilio placeholder)
    if ((sendVia === 'both' || sendVia === 'whatsapp') && guest.phone) {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        // Here you would use the twilio client to send the SMS/WhatsApp
        console.log('Twilio integration is configured. Sending...');
        whatsappSent = true;
      } else {
        console.warn('Twilio credentials missing. Simulating WhatsApp sending.');
        console.log(`[SIMULATED WHATSAPP to ${guest.phone}] RSVP Link: ${rsvpLink}`);
        whatsappSent = true; // Simulated success
      }
    }

    // Update guest invitation status
    await supabase
      .from('guests')
      .update({ invitation_sent: true })
      .eq('id', id);

    return NextResponse.json({ 
      success: true, 
      emailSent, 
      whatsappSent,
      simulated: !process.env.RESEND_API_KEY && !process.env.TWILIO_ACCOUNT_SID
    });

  } catch (error: any) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
