import { createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Parse FormData instead of JSON to handle the file upload
    const formData = await request.formData();
    const sendVia = formData.get('sendVia') as string;
    const senderName = formData.get('senderName') as string;
    const eventName = formData.get('eventName') as string;
    const file = formData.get('file') as File | null;

    const supabase = createServiceClient();

    // Fetch guest details
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*, events(event_name)')
      .eq('id', id)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    const hostUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const rsvpLink = `${hostUrl}/rsvp/${guest.id}`;
    
    let emailSent = false;
    let errors: string[] = [];

    // Send Email via Nodemailer
    if ((sendVia === 'both' || sendVia === 'email') && guest.email) {
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PASSWORD,
            },
          });
          
          // Prepare attachment if a file was uploaded
          let attachments = [];
          if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({
              filename: file.name,
              content: buffer,
              contentType: file.type
            });
          }

          await transporter.sendMail({
            from: `"${senderName || 'EventVerse'}" <${process.env.SMTP_EMAIL}>`,
            to: guest.email,
            subject: `You're invited to ${eventName}!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #9333ea;">Hi ${guest.guest_name},</h2>
                <p style="font-size: 16px;">You are warmly invited to <strong>${eventName}</strong>!</p>
                <p style="font-size: 16px;">From: ${senderName || 'Your Host'}</p>
                <div style="margin: 30px 0;">
                  <a href="${rsvpLink}" style="background-color: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Click here to RSVP
                  </a>
                </div>
                <p style="font-size: 14px; color: #666;">We hope to see you there!</p>
              </div>
            `,
            attachments
          });
          emailSent = true;
        } catch (error: any) {
          console.error('Failed to send Nodemailer email:', error);
          errors.push(`Email Error: ${error.message || 'Unknown SMTP error'}`);
        }
      } else {
        console.warn('SMTP_EMAIL or SMTP_PASSWORD is missing. Simulating email sending.');
        emailSent = true;
      }
    }

    // Update guest record to mark as sent
    await supabase
      .from('guests')
      .update({ invitation_sent: true })
      .eq('id', id);

    return NextResponse.json({ 
      success: errors.length === 0, 
      emailSent,
      whatsappSent: false, // Handled client-side now
      simulated: !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD,
      errors 
    });
  } catch (error) {
    console.error('Error in send-invitation route:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation request' },
      { status: 500 }
    );
  }
}
