/*
  # Fix Quotes Table RLS for Public Insert

  ## Overview
  This migration fixes the Row Level Security policies for the quotes table to properly allow
  anonymous (public) users to submit quote requests while maintaining security for other operations.

  ## Problem
  The current RLS policy for INSERT was not properly configured to allow anonymous users to insert quotes.

  ## Changes
  1. Drop and recreate the INSERT policy with proper configuration for anonymous users
  2. Ensure the policy explicitly allows public (anon) access for quote submissions
  3. Keep read/update/delete policies restricted to authenticated admin users only

  ## Security
  - Public users can ONLY insert new quotes (submit quote requests)
  - Only authenticated admin users can read, update, or delete quotes
  - This maintains security while allowing the core business function of quote requests
*/

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Anyone can submit quotes" ON quotes;

-- Create a proper INSERT policy that allows anonymous users
CREATE POLICY "Public users can submit quote requests"
  ON quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify other policies are properly restrictive
-- Update the SELECT policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can read quotes" ON quotes;
CREATE POLICY "Admins can read all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Update the UPDATE policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON quotes;
CREATE POLICY "Admins can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Update the DELETE policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can delete quotes" ON quotes;
CREATE POLICY "Admins can delete quotes"
  ON quotes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );