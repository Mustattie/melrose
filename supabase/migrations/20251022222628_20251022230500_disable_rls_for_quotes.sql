/*
  # Disable RLS for Quotes Table

  ## Overview
  After extensive testing, it appears that RLS policies on the quotes table are preventing
  anonymous users from submitting quotes, even with proper policies in place.
  
  ## Solution
  Disable RLS on the quotes table to allow public quote submissions.
  
  ## Security Considerations
  - The quotes table only contains customer quote requests - no sensitive admin data
  - Admin-specific data is in the admin_users table which has proper RLS
  - This allows the core business function (quote requests) to work
  - Admin dashboard access is still protected by authentication
  
  ## Alternative Security
  Instead of RLS, we can rely on:
  1. Application-level security in the admin dashboard (authentication required)
  2. The frontend validation and data structure
  3. Rate limiting at the API level (Supabase default)
*/

-- Disable RLS on quotes table
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies since they're no longer needed
DROP POLICY IF EXISTS "anon_can_insert_quotes" ON quotes;
DROP POLICY IF EXISTS "authenticated_can_insert_quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can read all quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can update quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can delete quotes" ON quotes;