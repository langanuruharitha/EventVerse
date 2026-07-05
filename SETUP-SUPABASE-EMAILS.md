# 📧 Setup Real Email Notifications in Supabase

## 🎯 What This Enables:

1. ✅ Login alert emails: "EventVerse: You logged in"
2. ✅ Password reset emails with real reset links
3. ✅ Email verification for new signups
4. ✅ Security notifications

## 🔧 Step-by-Step Setup

### Step 1: Configure Supabase Email Settings

1. Go to https://supabase.com/dashboard
2. Select your **EventVerse** project
3. Click **Authentication** in left sidebar
4. Click **Email Templates**

### Step 2: Enable Email Confirmations (Optional)

1. In **Authentication** → **Providers**
2. Click **Email** provider
3. Toggle these settings:
   - ✅ **Confirm email** - ON (users must verify email)
   - ✅ **Secure email change** - ON (verify new email before change)

### Step 3: Customize Email Templates

#### A. Login Alert Email (Magic Link Template)

We'll modify the "Magic Link" template to send login alerts:

**Template**: Authentication → Email Templates → Magic Link

```html
<h2>Login Alert - EventVerse</h2>
<p>Hello,</p>
<p><strong>You logged into your EventVerse account.</strong></p>
<p><strong>Time:</strong> {{ .SiteURL }}</p>
<p>If this wasn't you, please reset your password immediately.</p>
<p>Thanks,<br>EventVerse Team</p>
```

#### B. Password Reset Email

**Template**: Authentication → Email Templates → Reset Password

```html
<h2>Reset Your Password - EventVerse</h2>
<p>Hello,</p>
<p>Someone requested a password reset for your EventVerse account.</p>
<p><a href="{{ .ConfirmationURL }}">Click here to reset your password</a></p>
<p>This link expires in 60 minutes.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Thanks,<br>EventVerse Team</p>
```

#### C. Email Verification (Signup)

**Template**: Authentication → Email Templates → Confirm Signup

```html
<h2>Welcome to EventVerse!</h2>
<p>Hello,</p>
<p>Thanks for signing up! Please confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>This link expires in 24 hours.</p>
<p>Thanks,<br>EventVerse Team</p>
```

### Step 4: Configure SMTP (For Custom Emails - Optional)

By default, Supabase sends emails from their domain. To use your own domain:

1. **Authentication** → **Settings** → **SMTP Settings**
2. Configure your SMTP provider (Gmail, SendGrid, AWS SES, etc.)

**Example with Gmail:**
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [App Password]
Sender Email: noreply@yourdomain.com
```

### Step 5: Test Email Sending

1. **Create test account**: Sign up with your real email
2. **Check inbox**: You should receive verification email
3. **Test password reset**: Use "Forgot Password" link
4. **Test login**: You'll receive login confirmation

## 🔐 Security Best Practices

### Rate Limiting (Already Configured in Supabase)
- Max 4 password reset requests per hour
- Max 6 signup attempts per hour per IP
- Max 100 login attempts per hour per IP

### Email Verification Flow
```
User signs up → Email sent → User clicks link → Account verified → Can login
```

### Password Reset Flow
```
User clicks "Forgot Password" → Email sent → User clicks link → 
New password page → Password updated → Login with new password
```

## 📱 Receiving Emails on Phone

To get emails on your phone:
1. Make sure your email app is installed (Gmail, Outlook, etc.)
2. Add your email account to the app
3. Enable push notifications for that email
4. You'll get instant alerts when:
   - Someone logs into your account
   - Password reset requested
   - New signup verification

## 🧪 Testing

### Test Customer Login Alert:
1. Sign up as customer with your real email
2. Verify email (check inbox)
3. Log out
4. Log in again
5. Check email for login alert

### Test Password Reset:
1. Go to sign-in page
2. Click "Forgot Password"
3. Enter your email
4. Check inbox for reset link
5. Click link and set new password

### Test Admin Login Alert:
1. Make your email an admin (run FIX-HARITHA-TO-ADMIN.sql)
2. Log in to admin panel
3. Check email for login alert

## ⚙️ Environment Variables (Already Set)

Your `.env.local` already has:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

No additional configuration needed!

## 🎯 Email Examples

### Login Alert Email:
```
Subject: EventVerse Login Alert
From: noreply@supabase.io

Hello,

You logged into your EventVerse account.
Time: [timestamp]
Location: [IP address]

If this wasn't you, reset your password immediately.

Thanks,
EventVerse Team
```

### Password Reset Email:
```
Subject: Reset Your EventVerse Password
From: noreply@supabase.io

Hello,

Click here to reset your password: [Reset Link]

This link expires in 60 minutes.

Thanks,
EventVerse Team
```

## 🚨 Important Notes

1. **Supabase Free Tier**: 10,000 emails per month
2. **Email Delivery**: May take 1-5 minutes
3. **Spam Folder**: Check spam if not in inbox
4. **Production**: Consider custom SMTP for better deliverability

## ✅ What's Already Working

Your app already has:
- ✅ Password reset page (`/auth/reset-password`)
- ✅ Forgot password page (`/auth/forgot-password`)
- ✅ Sign up with email verification
- ✅ Supabase auth callbacks configured

Just enable email templates in Supabase dashboard and it will work!

## 🔗 Useful Links

- Supabase Email Docs: https://supabase.com/docs/guides/auth/auth-email
- Custom SMTP: https://supabase.com/docs/guides/auth/auth-smtp
