# 🔔 Customer & Vendor Login Tracking System

## ✅ What Was Added

### NEW: Login Tracking
- **Track every customer login** ✅
- **Track every vendor login** ✅
- **Show notifications in admin portal** ✅
- **Prepare for email alerts to harithalanganuru@gmail.com** ✅

### Features
1. **Admin Notifications Page** (`/admin/notifications`)
   - See all signups AND logins
   - Filter by: Signup, Login, Vendor, Customer, Unread
   - Real-time updates every 30 seconds

2. **Login History Tracking**
   - New table: `user_login_history`
   - Records: User, Email, Role, Login Time
   - Admins can view full login history

3. **Automatic Notifications**
   - 🏪 "Vendor Login" notifications
   - 👤 "Customer Login" notifications
   - Shows who logged in and when

## 🔧 Setup Instructions

### Step 1: Fix Your Admin Role First

Run this SQL in Supabase:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'harithalanganuru@gmail.com';
```

**File**: `lib/supabase/FIX-HARITHA-TO-ADMIN.sql`

### Step 2: Set Up Login Tracking

Run this SQL in Supabase:

1. Go to https://supabase.com/dashboard
2. Select your EventVerse project
3. Click **SQL Editor**
4. Copy ALL the SQL from: `lib/supabase/TRACK-CUSTOMER-LOGINS.sql`
5. Paste and click **RUN**
6. You should see: ✅ "Login tracking system created!"

### Step 3: Deploy and Test

1. **Wait 1-2 minutes** for Vercel to deploy
2. **Test login tracking**:
   - Sign out if logged in
   - Sign in as a customer or vendor
   - Go to `/admin/notifications`
   - You should see: 👤 "Customer Login" or 🏪 "Vendor Login" notification!

## 📊 What You'll See

### In Admin Notifications Page:

**Signup Notifications:**
- 🏪 New Vendor Registration: vendor@example.com
- 👤 New Customer Registration: customer@example.com

**Login Notifications (NEW!):**
- 🏪 Vendor Login: vendor@example.com
- 👤 Customer Login: customer@example.com

### Details Shown:
- User email
- Type (vendor/customer)
- Action (signup/login)
- Timestamp ("Just now", "5m ago", "2h ago")
- Read/Unread status

## 🎯 How It Works

### When Customer/Vendor Signs Up:
1. User creates account
2. Database trigger (`notify_admin_on_signup`) fires
3. Notification created in `admin_notifications`
4. Shows in `/admin/notifications`

### When Customer/Vendor Logs In:
1. User logs in successfully
2. Function `log_user_login()` is called
3. Login recorded in `user_login_history` table
4. Notification created in `admin_notifications`
5. Shows in `/admin/notifications`

### Admin Doesn't Get Tracked:
- When harithalanganuru@gmail.com (admin) logs in
- NO notification is created
- System only tracks customers and vendors

## 📧 Email Notifications Setup (Optional)

To receive actual emails to **harithalanganuru@gmail.com**:

### Option 1: Resend (Recommended)

1. Sign up at https://resend.com (Free tier: 100 emails/day)
2. Get your API key
3. Add to Vercel Environment Variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
4. Install package:
   ```bash
   npm install resend
   ```
5. Update `app/api/admin/send-signup-email/route.ts`
6. Uncomment the Resend email code

### Option 2: Supabase Database Webhook

1. Go to Supabase Dashboard
2. **Database** → **Webhooks**
3. Create webhook on `admin_notifications` table
4. Trigger: INSERT
5. URL: Email service endpoint (e.g., SendGrid, Mailgun)
6. Payload: Include `{user_email}`, `{type}`, `{message}`

## 📝 Database Tables

### `admin_notifications`
- Stores all signup and login notifications
- Columns: id, type, title, message, user_email, user_type, is_read, created_at

### `user_login_history`
- Stores login history for analytics
- Columns: id, user_id, user_email, user_role, login_time

### `admin_email_settings`
- Stores admin email preferences
- Default: harithalanganuru@gmail.com

## 🚀 Testing

### Test Customer Login Tracking:
1. Create a test customer account (or use existing)
2. Sign in as that customer
3. Go to `/admin/notifications` (as admin)
4. You should see: 👤 "Customer Login: test@example.com"

### Test Vendor Login Tracking:
1. Create a test vendor account (or use existing)
2. Sign in as that vendor
3. Go to `/admin/notifications` (as admin)
4. You should see: 🏪 "Vendor Login: vendor@example.com"

## ✅ Checklist

- [ ] Run `FIX-HARITHA-TO-ADMIN.sql` in Supabase
- [ ] Run `TRACK-CUSTOMER-LOGINS.sql` in Supabase
- [ ] Run `ADMIN-NOTIFICATIONS-SYSTEM.sql` in Supabase (if not done already)
- [ ] Wait for Vercel deployment to complete
- [ ] Test customer login → check notifications
- [ ] Test vendor login → check notifications
- [ ] (Optional) Set up email service for email alerts

## 🎉 Summary

**You will now get notifications when:**
1. ✅ New customer signs up
2. ✅ New vendor signs up
3. ✅ Existing customer logs in (NEW!)
4. ✅ Existing vendor logs in (NEW!)

**You will NOT get notifications when:**
- ❌ Admin (harithalanganuru@gmail.com) logs in

All notifications appear in **`/admin/notifications`** page with badge count in sidebar!

---

**Files Created:**
- `lib/supabase/TRACK-CUSTOMER-LOGINS.sql` - Login tracking SQL
- `lib/supabase/FIX-HARITHA-TO-ADMIN.sql` - Fix admin role
- Updated: `lib/auth/actions.ts` - Added login tracking
- Updated: `app/auth/callback/route.ts` - Added login tracking
- Updated: `app/api/vendor/auth/login/route.ts` - Added vendor login tracking
