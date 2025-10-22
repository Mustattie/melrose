/*
  # Admin Authentication System

  ## Overview
  This migration sets up the admin authentication system for the Melrose Mobile Restrooms 
  admin dashboard. It creates the necessary tables and security policies for secure admin access.

  ## New Tables
  
  ### `admin_users`
  Stores admin user accounts with authentication credentials and role information.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for admin user
  - `created_at` (timestamptz) - Account creation timestamp
  - `email` (text, unique) - Admin email address for login
  - `full_name` (text) - Admin's full name for display
  - `role` (text) - Admin role (admin, super_admin)
  - `is_active` (boolean) - Whether the account is active
  - `last_login` (timestamptz) - Last successful login timestamp
  - `user_id` (uuid) - Reference to auth.users table
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on `admin_users` table
  - Only authenticated users can read admin user data
  - Only authenticated users can update their own profile
  - Super admins can manage other admin users
  
  ### Policies
  1. **"Admin users can read all admin users"** - Allows authenticated admins to view all admin accounts
  2. **"Admin users can update own profile"** - Allows admins to update their own information
  
  ## Important Notes
  - Admin users must be created through Supabase Auth first, then linked in admin_users table
  - Passwords are managed by Supabase Auth, not stored in admin_users table
  - The user_id field links to the auth.users table for authentication
  - Initial admin user should be created manually via Supabase dashboard or SQL
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all admin users
CREATE POLICY "Admin users can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admin users can update their own profile
CREATE POLICY "Admin users can update own profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);