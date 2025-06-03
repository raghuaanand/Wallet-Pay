-- SQL script to check and fix missing balance records
-- Run this in your production database if needed

-- 1. Check for users without balance records
SELECT u.id, u.name, u.number, b.id as balance_id 
FROM "User" u 
LEFT JOIN "Balance" b ON u.id = b."userId" 
WHERE b.id IS NULL;

-- 2. Create missing balance records (run only if step 1 shows missing records)
INSERT INTO "Balance" ("userId", amount, locked) 
SELECT id, 0, 0 FROM "User" u 
WHERE NOT EXISTS (SELECT 1 FROM "Balance" b WHERE b."userId" = u.id);

-- 3. Verify all users now have balance records
SELECT COUNT(*) as total_users, 
       COUNT(b.id) as users_with_balance 
FROM "User" u 
LEFT JOIN "Balance" b ON u.id = b."userId";
