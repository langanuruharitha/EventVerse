import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'harithalanganuru@gmail.com';

export async function POST(request: Request) {
  try {
    const { email, fullName, role, type } = await request.json();
    
    const supabase = await createServerClient();

    // Prepare email content based on type
    let subject = '';
    let message = '';

    if (type === 'signup') {
      subject = `🎉 New ${role === 'vendor' ? 'Vendor' : 'Customer'} Signup - EventVerse`;
      message = `
Hello Admin,

Great news! A new ${role} has joined EventVerse.

📋 User Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${fullName}
• Email: ${email}
• Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
• Date: ${new Date().toLocaleString()}

You can view and manage this user in your admin dashboard:
${process.env.NEXT_PUBLIC_SITE_URL}/admin/users

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
EventVerse System
      `.trim();
    } else if (type === 'login') {
      subject = `👤 User Login Notification - EventVerse`;
      message = `
Hello Admin,

A user has logged into EventVerse.

📋 Login Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${fullName}
• Email: ${email}
• Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
• Time: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
EventVerse System
      `.trim();
    }

    // Store notification in database (all admins can see it)
    const { error: logError } = await supabase
      .from('admin_notifications')
      .insert({
        type: type,
        title: subject,
        message: message,
        user_email: email,
        user_name: fullName,
        user_role: role,
        is_read: false,
      });

    if (logError) {
      console.error('Error logging notification:', logError);
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin notified'
    });

  } catch (error: any) {
    console.error('Error notifying admin:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
