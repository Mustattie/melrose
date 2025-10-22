/*
  # Fix Contacts Table RLS Policies

  ## Overview
  This migration updates the contacts table RLS policies to match the proper security model.

  ## Changes
  1. Update INSERT policy to allow anonymous users (anon role)
  2. Restrict SELECT, UPDATE, DELETE to authenticated admin users only

  ## Security
  - Anonymous users can submit contact forms
  - Only authenticated admin users can read, update, or delete contacts
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;

-- Create proper INSERT policy for anonymous users
CREATE POLICY "Public users can submit contact forms"
  ON contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Restrict SELECT to admin users only
CREATE POLICY "Admins can read all contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Restrict UPDATE to admin users only
CREATE POLICY "Admins can update contacts"
  ON contacts
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

-- Add DELETE policy for admin users
CREATE POLICY "Admins can delete contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );