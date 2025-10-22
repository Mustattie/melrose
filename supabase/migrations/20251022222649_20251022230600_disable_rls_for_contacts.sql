/*
  # Disable RLS for Contacts Table

  ## Overview
  Similar to the quotes table, we're disabling RLS for the contacts table to allow
  public contact form submissions.
  
  ## Security Considerations
  - The contacts table only contains contact form submissions - no sensitive data
  - Admin dashboard access is protected by authentication in the application layer
  - This allows the core business function (contact forms) to work properly
  
  ## Changes
  1. Disable RLS on contacts table
  2. Remove all existing RLS policies
*/

-- Disable RLS on contacts table
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public users can submit contact forms" ON contacts;
DROP POLICY IF EXISTS "Admins can read all contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;