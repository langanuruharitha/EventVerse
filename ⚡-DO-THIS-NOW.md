# ⚡ DO THIS RIGHT NOW (5 Minutes)

## Problem: Your account is "customer" not "admin"

You need to change your account role to admin so you can see notifications.

---

## 🎯 SCRIPT 1: Make Yourself Admin

**Open Supabase Dashboard** → **SQL Editor** → **Copy/Paste This:**

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'harithalanganuru@gmail.com';

SELECT email, role, '✅ You are now an admin!' as status
FROM users
WHERE email = 'harithalanganuru@gmail.com';
```

**Click RUN** → See "✅ You are now an admin!"

---

## 🎯 SCRIPT 2: Create Notifications Table

**SQL Editor** → **New Query** → **Copy/Paste This:**

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS admin_notifications CASCADE;

CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_notification_type CHECK (type IN ('signup', 'login'))
);

CREATE INDEX idx_admin_notifications_unread ON admin_notifications(is_read, created_at DESC);
CREATE INDEX idx_admin_notifications_type ON admin_notifications(type, created_at DESC);
CREATE INDEX idx_admin_notifications_created ON admin_notifications(created_at DESC);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notifications" ON admin_notifications
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "System can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (true);

SELECT '✅ Table created!' as status;
```

**Click RUN** → See "✅ Table created!"

---

## 🎯 STEP 3: Sign Out and Back In

1. **Sign out** from EventVerse
2. **Sign in** again with `harithalanganuru@gmail.com`
3. You should now see **ADMIN DASHBOARD** (not customer dashboard)
4. Sidebar should show **"Notifications 🔔"** menu
5. Click it and go to `/admin/notifications`

---

## 🎯 STEP 4: Test It

1. **Open incognito window**
2. **Sign up** as new customer (use any test email)
3. **Go back to admin window**
4. **Refresh** `/admin/notifications`
5. **You should see:** 🎉 New signup notification!

---

**DO SCRIPT 1 AND SCRIPT 2 IN SUPABASE NOW!** ⚡

Then sign out and back in! 🚀
