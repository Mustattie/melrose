/*
  # Simplify Quotes Insert Policy

  ## Overview
  This migration simplifies the INSERT policy on quotes to ensure anonymous users can submit quotes.
  
  ## Changes
  1. Drop the existing INSERT policy
  2. Create a new, simpler INSERT policy with explicit permissions for public role
  3. Ensure the policy is as permissive as possible for INSERT operations

  ## Testing
  This was tested successfully with `SET ROLE anon; INSERT INTO quotes...` and worked.
  This migration ensures the production environment matches the test.
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Public users can submit quote requests" ON quotes;

-- Create the simplest possible INSERT policy for anonymous users
CREATE POLICY "enable_insert_for_anon"
  ON quotes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure anon role has explicit INSERT permission (should already exist but let's be sure)
GRANT INSERT ON quotes TO anon;
GRANT INSERT ON quotes TO authenticated;