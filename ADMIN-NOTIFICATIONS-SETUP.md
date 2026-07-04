# Admin Notifications System Setup

## ✅ What Was Added

### 1. **Notifications Page** (`/admin/notifications`)
- View all new vendor and customer signups
- See unread notifications with badge
- Mark notifications as read
- Filter by: All, Unread, Vendor, Customer
- Auto-refreshes every 30 seconds

### 2. **Navigation with Badge**
- "Notifications 🔔" link in admin sidebar
- Red badge shows unread notification count
- Updates in real-time

### 3. **Database System**
- `admin_notifications` table tracks all signups
- Automatic trigger creates notification when users sign up
- Stores: user email, type (vendor/customer), timestamp, read status

## 🔧 Setup Instructions

### Step 1: Run SQL in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your EventVerse project
3. Click **SQL Editor** in the left sidebar
4. Open the file: `lib/supabase/ADMIN-NOTIFICATIONS-SYSTEM.sql`
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **RUN** button
8. You should see: ✅ Success messages

### Step 2: Verify Deployment

1. Wait 1-2 minutes for Vercel to deploy
2. Go to: https://eventverse-app-sand.vercel.app/admin/notifications
3. You should see the notifications page (empty at first)

### Step 3: Test It

1. Have someone sign up as a vendor or customer
2. OR create a test account yourself
3. Go to `/admin/notifications`
4. You should see: 🔔 New signup notification!
5. The notification badge will show in the sidebar

## 📧 Email Notifications (Optional)

Currently, notifications only appear in the admin panel. To receive actual emails to **harithalanganuru@gmail.com**:

### Option 1: Use Resend (Recommended - Free tier available)

1. Go to https://resend.com and sign up
2. Get your API key
3. Add to Vercel Environment Variables:
   ```
   RESEND_API_KEY=your_api_key_here
   ```
4. Install Resend SDK:
   ```bash
   npm install resend
   ```
5. The email code is already prepared in:
   `app/api/admin/send-signup-email/route.ts`

### Option 2: Use SendGrid

1. Sign up at https://sendgrid.com
2. Get API key
3. Add to environment variables
4. Update the email sending code

### Option 3: Use Supabase Edge Functions with SMTP

1. Set up SMTP server (Gmail, Outlook, etc.)
2. Create Supabase Edge Function
3. Trigger on database insert

## 📊 What You'll See

### In Admin Panel:
- 🏪 New Vendor Registration notifications
- 👤 New Customer Registration notifications
- Unread count badge on Notifications link
- Real-time updates (polls every 30 seconds)

### Notification Details:
- User email
- User type (vendor/customer)
- Timestamp (e.g., "5m ago", "2h ago", "3d ago")
- Read/Unread status

## 🎯 Features

✅ Real-time notification tracking
✅ Unread badge in sidebar
✅ Filter by type (vendor/customer/unread)
✅ Mark as read functionality
✅ Auto-refresh every 30 seconds
✅ Shows user email and signup time
✅ Beautiful, responsive UI
✅ Persistent across page refreshes

## 🚀 Next Steps

1. **Run the SQL** in Supabase (most important!)
2. **Test** by creating a new user account
3. **Optional**: Set up email service for email alerts
4. **Monitor**: Check `/admin/notifications` regularly for new signups

---

**Note**: The system starts tracking signups AFTER you run the SQL. Previous signups won't appear in notifications.
