import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { userEmail, userType } = await request.json();

    // In production, you would use a service like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - AWS SES
    // - Or Supabase Edge Functions with SMTP

    // For now, we'll log it and you can set up email service later
    console.log(`📧 New ${userType} signup: ${userEmail}`);
    console.log(`Admin notification should be sent to: harithalanganuru@gmail.com`);

    // TODO: Implement actual email sending
    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'EventVerse <noreply@eventverse.com>',
      to: 'harithalanganuru@gmail.com',
      subject: `New ${userType} Registration`,
      html: `
        <h2>New ${userType} Registration</h2>
        <p>A new ${userType} has signed up:</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Notification logged (email service not configured yet)'
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
