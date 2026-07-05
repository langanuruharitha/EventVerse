# 🗑️ Complete Guide: Delete Test Users

## 🎯 Two Solutions Available

### ✅ Solution 1: Quick Fix (Delete Now)
**File:** `DELETE-CUSTOMER-CUSTOMER2.sql`  
**Purpose:** Delete customer@gmail.com and customer2@gmail.com immediately  
**Time:** 30 seconds

### 🔧 Solution 2: Structural Fix (Prevent Future Errors)
**File:** `FIX-VENDOR-LEAD-FK-CASCADE.sql`  
**Purpose:** Update database so user deletions work automatically  
**Time:** 30 seconds

---

## 🚀 RECOMMENDED: Run Both (Best Practice)

### Step 1: Run Structural Fix First (Prevents future issues)
1. Open **Supabase Dashboard** → **SQL Editor**
2. Open file: `lib/supabase/FIX-VENDOR-LEAD-FK-CASCADE.sql`
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click **RUN**
6. Wait for: `✅ Foreign key constraint updated to CASCADE!`

### Step 2: Run Quick Fix (Delete test users)
1. In the same **SQL Editor**
2. Click **New Query**
3. Open file: `lib/supabase/DELETE-CUSTOMER-CUSTOMER2.sql`
4. Copy ALL the SQL code
5. Paste into SQL Editor
6. Click **RUN**
7. Wait for: `customer@gmail.com and customer2@gmail.com deleted! ✅`

### Step 3: Verify
1. Go to **Authentication** → **Users**
2. Check that only `harithalanganuru@gmail.com` remains
3. Test accounts are gone! ✅

---

## 🔍 What Each Script Does

### Script 1: FIX-VENDOR-LEAD-FK-CASCADE.sql
**The Problem:**
- Foreign key `vendor_lead_actions_action_by_fkey` blocks user deletion
- Error: "violates foreign key constraint"

**The Fix:**
- Changes FK behavior from `RESTRICT` to `CASCADE`
- When user is deleted → their actions are automatically deleted too
- No more FK errors!

**Benefits:**
- ✅ Deleting users from dashboard will work
- ✅ No more "Database error deleting user"
- ✅ Follows best practices (actions belong to user)
- ✅ Future-proof solution

---

### Script 2: DELETE-CUSTOMER-CUSTOMER2.sql
**What It Deletes:**

1. **vendor_lead_actions** - Actions performed by these users
2. **vendor_lead_actions** - Actions on their leads
3. **vendor_leads** - Leads created by these users
4. **vendor_inquiries** - Their inquiries to vendors
5. **vendor_notifications** - Their notifications
6. **events** - Events created (+ guests, budgets, tasks)
7. **user_profiles** - Profile data
8. **users** - Public users table
9. **auth.users** - Supabase authentication

**Safe:**
- ❌ Does NOT delete: `harithalanganuru@gmail.com` (admin)
- ❌ Does NOT delete: Any other users
- ✅ Only deletes: `customer@gmail.com` and `customer2@gmail.com`

---

## 📋 Quick Reference

### If You Only Want to Delete Users (Not Fix FK):
```sql
-- Run: DELETE-CUSTOMER-CUSTOMER2.sql
-- This handles the current FK issue manually
-- But future deletions may still have problems
```

### If You Want Long-Term Solution:
```sql
-- 1. Run: FIX-VENDOR-LEAD-FK-CASCADE.sql (one time)
-- 2. Run: DELETE-CUSTOMER-CUSTOMER2.sql
-- 3. Future user deletions will work from dashboard!
```

---

## 🎓 Understanding Foreign Keys

### Current Behavior (RESTRICT):
```
User (customer@gmail.com)
  └─> vendor_lead_actions (action_by = user_id)
  
Delete user? ❌ ERROR: "violates foreign key constraint"
```

### After CASCADE Fix:
```
User (customer@gmail.com)
  └─> vendor_lead_actions (action_by = user_id)
  
Delete user? ✅ Automatically deletes related actions too!
```

---

## 💡 Alternative Approach (SET NULL)

If you want to keep action history after user deletion:

**Option:** Modify `FIX-VENDOR-LEAD-FK-CASCADE.sql`  
**Change line 41 to:**
```sql
ON DELETE SET NULL
```

**Result:**
- User is deleted
- Actions remain in database
- `action_by` field becomes `NULL` (anonymous action)
- Useful for audit trails

---

## ⚠️ Important Notes

1. **Cannot Undo** - Deleted users cannot be recovered
2. **Run Structural Fix Once** - It applies to all future deletions
3. **Backup First** (Optional) - Export users table if concerned
4. **Test on Staging** (Optional) - If you have a staging database

---

## ✅ Expected Results

### After Structural Fix:
```
✅ Foreign key constraint updated to CASCADE!
Users can now be deleted without FK errors in vendor_lead_actions
```

### After Delete Script:
```
customer@gmail.com and customer2@gmail.com deleted! ✅

Remaining users:
- harithalanganuru@gmail.com (admin)
```

---

## 🔧 Troubleshooting

### Error: "constraint does not exist"
**Cause:** FK constraint already has CASCADE or different name  
**Solution:** Script will skip and continue

### Error: "permission denied"
**Cause:** Not running as database owner  
**Solution:** Ensure you're logged into correct Supabase project

### Error: "relation does not exist"
**Cause:** Table name mismatch  
**Solution:** Check if `vendor_lead_actions` table exists

---

## 📞 Need Help?

If you encounter any errors:
1. Copy the FULL error message
2. Take a screenshot of SQL Editor
3. Share with me for quick fix

---

**🎯 Ready? Go to Supabase SQL Editor and run both scripts now!**
