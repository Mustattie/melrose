/*
  # Fix Anonymous Insert Policy for Quotes

  ## Overview
  This migration fixes the RLS policy to allow anonymous (unauthenticated) users to insert quotes.
  The issue was that using 'public' role wasn't working as expected.
  
  ## Changes
  1. Drop existing INSERT policy
  2. Create separate policies for anon and authenticated roles
  3. Use explicit role names instead of 'public'

  ## Security
  - Anonymous users can INSERT quotes (public-facing quote requests)
  - Only authenticated admin users can SELECT, UPDATE, DELETE
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "enable_insert_for_anon" ON quotes;

-- Create policy specifically for anon role
CREATE POLICY "anon_can_insert_quotes"
  ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert (just in case)
CREATE POLICY "authenticated_can_insert_quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);