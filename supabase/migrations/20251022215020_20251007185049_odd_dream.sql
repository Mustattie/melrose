/*
  # Create contacts table for general inquiries

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text) - Contact name
      - `email` (text) - Contact email
      - `phone` (text, nullable) - Contact phone
      - `message` (text) - Contact message
      - `status` (text) - Contact status

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for public to insert contacts
    - Add policy for authenticated users to read all contacts (for admin)
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed'))
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contacts (for contact form submissions)
CREATE POLICY "Anyone can submit contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all contacts (for admin dashboard)
CREATE POLICY "Authenticated users can read contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update contacts (for admin management)
CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true);