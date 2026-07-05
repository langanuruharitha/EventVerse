# 📧 Add Real Email Notifications to Admin

## Current Status
- ✅ Notifications stored in database
- ✅ Viewable at `/admin/notifications`
- ❌ No actual emails sent

## How to Add Real Emails

### Step 1: Sign up for Resend (Free)
1. Go to [resend.com](https://resend.com)
2. Sign up (100 emails/day free)
3. Verify your email
4. Get your API key from dashboard

### Step 2: Add Domain (Optional but Recommended)
1. In Resend dashboard, add your domain
2. Or use: `onboarding@resend.dev` (for testing)

### Step 3: Install Resend Package
```bash
npm install resend
```

### Step 4: Add API Key to .env.local
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Step 5: Update API Route

Open: `app/api/admin/notify-signup/route.ts`

Add at the top:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'harithalanganuru@gmail.com';
```

Replace the section after `message = ...` with:
```typescript
// Store notification in database
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
}

// Send actual email using Resend
try {
  await resend.emails.send({
    from: 'EventVerse <notifications@resend.dev>', // Change after domain verification
    to: ADMIN_EMAIL,
    subject: subject,
    text: message,
  });
  
  console.log('Email sent to admin successfully');
} catch (emailError) {
  console.error('Error sending email:', emailError);
  // Don't fail the request if email fails
}
```

### Step 6: Deploy to Vercel
```bash
git add .
git commit -m "Add email notifications with Resend"
git push
```

### Step 7: Add Environment Variable in Vercel
1. Go to Vercel Dashboard
2. Your EventVerse project → Settings → Environment Variables
3. Add: `RESEND_API_KEY` = `re_xxxxxxxxxxxxx`
4. Redeploy

---

## ✅ After Setup

When someone signs up or logs in:
- ✅ Notification saved to database
- ✅ Email sent to harithalanganuru@gmail.com
- ✅ Viewable in admin panel

---

## 🎯 Quick Test

After deploying:
1. Sign up with a test email
2. Check your email (harithalanganuru@gmail.com)
3. You should receive the notification email! 📧

---

## 💰 Pricing

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Perfect for admin notifications!

**If you need more:**
- $20/month for 50,000 emails

---

## 🔧 Alternative: SendGrid

If you prefer SendGrid:
1. Sign up at sendgrid.com (free 100 emails/day)
2. Get API key
3. Use `@sendgrid/mail` package instead

---

## ⚠️ Important Notes

1. **Testing:** Use `onboarding@resend.dev` as sender until domain verified
2. **Domain:** Verify your domain for better deliverability
3. **Rate Limits:** Free tier = 100 emails/day (enough for admin notifications)

---

## 🆘 Troubleshooting

**Emails not arriving?**
- Check spam folder
- Verify API key is correct in Vercel
- Check Resend dashboard logs
- Make sure ADMIN_EMAIL is correct

**Still in database only?**
- Verify Resend package installed: `npm list resend`
- Check Vercel environment variables
- Look at Vercel logs for errors

---

**For now, check notifications in admin panel at `/admin/notifications`!** 📊
