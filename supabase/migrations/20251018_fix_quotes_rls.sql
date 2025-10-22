/*
  # Fix RLS Policy for Anonymous Quote Submissions

  1. Changes
    - Drop ALL existing policies on quotes table
    - Recreate policies with correct permissions
    - Explicitly allow anonymous (anon) users to insert quotes
    - Allow authenticated users to read and update quotes (for admin)

  2. Security
    - INSERT: Open to anon and authenticated
    - SELECT: Only authenticated users (admin)
    - UPDATE: Only authenticated users (admin)
*/

-- Drop ALL existing policies on quotes table
DROP POLICY IF EXISTS "Anyone can submit quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can read quotes" ON quotes;
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON quotes;
DROP POLICY IF EXISTS "Allow public quote submissions" ON quotes;

-- Verify RLS is enabled
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for anonymous and authenticated users
CREATE POLICY "quotes_insert_policy"
  ON quotes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create SELECT policy for authenticated users only
CREATE POLICY "quotes_select_policy"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Create UPDATE policy for authenticated users only
CREATE POLICY "quotes_update_policy"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
