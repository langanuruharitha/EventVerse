# 📚 Delete Test Users - Complete Documentation

## 🎯 Problem Summary

**Error:** `Failed to delete user: Database error`

**Root Cause:** Foreign key constraint `vendor_lead_actions_action_by_fkey` prevents user deletion because:
- Users have actions in `vendor_lead_actions` table
- Current FK behavior is `RESTRICT` (blocks deletion)
- User ID `2e498ab3-67de-4536-8932-52f74f13c6aa` is referenced

**Users to Delete:**
- ❌ customer@gmail.com
- ❌ customer2@gmail.com

**Keep:**
- ✅ harithalanganuru@gmail.com (admin)

---

## 🛠️ Solutions Provided

### 1️⃣ Quick Fix (Immediate Deletion)
**File:** `DELETE-CUSTOMER-CUSTOMER2.sql`

**What it does:**
- Manually deletes dependent rows in correct order
- Deletes from `vendor_lead_actions` first (fixes FK error)
- Then deletes leads, inquiries, events, profiles, users
- Handles both `action_by` and `lead_id` references

**When to use:**
- You need to delete users NOW
- You'll handle future deletions manually

---

### 2️⃣ Structural Fix (Long-term Solution)
**File:** `FIX-VENDOR-LEAD-FK-CASCADE.sql`

**What it does:**
- Updates FK constraint behavior from `RESTRICT` to `CASCADE`
- Future user deletions automatically delete their actions
- No more "violates foreign key constraint" errors
- Works from Supabase dashboard too!

**When to use:**
- You want a permanent fix
- You want dashboard delete button to work
- Best practice for production

---

### 3️⃣ General Script (All Test Users)
**File:** `FORCE-DELETE-TEST-USERS.sql`

**What it does:**
- Deletes ALL test accounts at once:
  - customer@gmail.com
  - customer1@gmail.com
  - customer2@gmail.com
  - vendor@gmail.com
  - vendor1@gmail.com

**When to use:**
- You want to clean up all test accounts
- Fresh start with only real users

---

## 📋 Recommended Workflow

### Option A: Fix Everything (Best)
```
1. Run: FIX-VENDOR-LEAD-FK-CASCADE.sql
   → Fixes FK constraint (one-time)

2. Run: DELETE-CUSTOMER-CUSTOMER2.sql
   → Deletes test users

Result: ✅ Database fixed + users deleted
```

### Option B: Quick Delete Only
```
1. Run: DELETE-CUSTOMER-CUSTOMER2.sql
   → Deletes test users

Result: ✅ Users deleted (but FK issue remains for future)
```

### Option C: Delete All Test Users
```
1. Run: FIX-VENDOR-LEAD-FK-CASCADE.sql
   → Fixes FK constraint

2. Run: FORCE-DELETE-TEST-USERS.sql
   → Deletes ALL test accounts

Result: ✅ Clean database with only real users
```

---

## 🎓 Technical Details

### Foreign Key Constraint Issue

**Current Setup:**
```sql
vendor_lead_actions (
  action_by UUID REFERENCES users(id)  -- Default: ON DELETE RESTRICT
)
```

**Problem:**
- `RESTRICT` = Cannot delete user if referenced anywhere
- Throws error: "violates foreign key constraint"

**Solution:**
```sql
vendor_lead_actions (
  action_by UUID REFERENCES users(id) ON DELETE CASCADE
)
```

**Result:**
- `CASCADE` = When user deleted, automatically delete their actions
- No more errors!

---

### Delete Order Matters

Must delete in this order to avoid FK errors:

```
1. vendor_lead_actions (where action_by = user)
2. vendor_lead_actions (where lead belongs to user)
3. vendor_leads (created by user)
4. vendor_inquiries (from user)
5. vendor_notifications (for user)
6. events (created by user) → cascades to guests, budgets, tasks
7. user_profiles
8. users (public table)
9. auth.users (authentication)
```

---

## 📁 File Index

| File | Type | Purpose |
|------|------|---------|
| `FIX-VENDOR-LEAD-FK-CASCADE.sql` | Structural | Fix FK constraint to CASCADE |
| `DELETE-CUSTOMER-CUSTOMER2.sql` | Quick Fix | Delete 2 specific users |
| `FORCE-DELETE-TEST-USERS.sql` | Bulk Delete | Delete all 5 test users |
| `DELETE-USERS-GUIDE.md` | Guide | Detailed explanation |
| `🚀-RUN-THIS-TO-DELETE-USERS.md` | Quick Start | Simple steps |
| `README-DELETE-USERS.md` | This File | Complete overview |

---

## 🚀 Quick Start

**For most users:**

1. Open Supabase → SQL Editor
2. Run: `FIX-VENDOR-LEAD-FK-CASCADE.sql`
3. Run: `DELETE-CUSTOMER-CUSTOMER2.sql`
4. Verify in Authentication → Users
5. Done! ✅

**Detailed instructions:**
- See: `🚀-RUN-THIS-TO-DELETE-USERS.md`

---

## ⚠️ Important Notes

1. **Backup:** Deletions cannot be undone
2. **Admin Safe:** Scripts never delete harithalanganuru@gmail.com
3. **Run Once:** Structural fix only needs to run once
4. **Production:** Test on staging first (if available)

---

## 🆘 Troubleshooting

### Error: "violates foreign key constraint"
**Solution:** Run `FIX-VENDOR-LEAD-FK-CASCADE.sql` first

### Error: "relation does not exist"
**Solution:** Check table name, may vary by database version

### Error: "permission denied"
**Solution:** Ensure you're logged into correct Supabase project

### Users still showing after delete
**Solution:** 
- Refresh Authentication → Users page
- Check both `users` and `auth.users` tables

---

## ✅ Success Indicators

After running scripts, you should see:

```
✅ Foreign key constraint updated to CASCADE!
✅ customer@gmail.com and customer2@gmail.com deleted!
```

And in Authentication → Users:
```
✅ Only harithalanganuru@gmail.com remains
✅ Test accounts gone
```

---

## 📞 Need Help?

If you encounter any issues:
1. Copy the FULL error message
2. Note which script you ran
3. Share for quick assistance

---

**Ready to start? Open `🚀-RUN-THIS-TO-DELETE-USERS.md` for simple instructions!**
