/*
  # Create Admin User Signup Function

  ## Overview
  This migration creates a function to easily add authenticated users to the admin_users table.
  It also creates a trigger to automatically handle this on signup if configured.

  ## New Functions
  1. **`create_admin_user`** - Function to add a user to admin_users table
  
  ## Usage
  After a user signs up through Supabase Auth UI, call this function to grant them admin access:
  
  ```sql
  SELECT create_admin_user(
    'user@example.com',
    'User Full Name',
    'admin' -- or 'super_admin'
  );
  ```
*/

-- Function to create an admin user from an authenticated user
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email text,
  user_full_name text,
  user_role text DEFAULT 'admin'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user_id uuid;
  admin_id uuid;
BEGIN
  -- Get the user_id from auth.users
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users', user_email;
  END IF;
  
  -- Insert or update admin_users
  INSERT INTO admin_users (email, full_name, role, is_active, user_id)
  VALUES (user_email, user_full_name, user_role, true, auth_user_id)
  ON CONFLICT (email)
  DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    user_id = EXCLUDED.user_id,
    is_active = true
  RETURNING id INTO admin_id;
  
  RETURN admin_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;