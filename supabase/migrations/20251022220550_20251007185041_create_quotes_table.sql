/*
  # Create quotes table for Melrose Mobile Restrooms

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text) - Customer name
      - `email` (text) - Customer email
      - `phone` (text) - Customer phone
      - `event_type` (text) - Type of event
      - `custom_event_type` (text, nullable) - Custom event type if "Other"
      - `guest_count` (text) - Number of guests
      - `event_date` (date) - Date of event
      - `start_time` (time) - Event start time
      - `end_time` (time) - Event end time
      - `event_location` (text) - Event location
      - `distance_from_mckinney` (integer) - Distance in miles
      - `water_connection` (text) - Water connection availability
      - `cleaning_attendant` (boolean) - Cleaning service add-on
      - `baby_changing_station` (boolean) - Baby changing station add-on
      - `additional_requests` (text, nullable) - Additional requests
      - `quote_amount` (integer) - Calculated quote amount in cents
      - `status` (text) - Quote status

  2. Security
    - Enable RLS on `quotes` table
    - Add policy for public to insert quotes
    - Add policy for authenticated users to read all quotes (for admin)
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  event_type text NOT NULL,
  custom_event_type text,
  guest_count text NOT NULL,
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  event_location text NOT NULL,
  distance_from_mckinney integer NOT NULL,
  water_connection text NOT NULL,
  cleaning_attendant boolean DEFAULT false,
  baby_changing_station boolean DEFAULT false,
  additional_requests text,
  quote_amount integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'completed', 'cancelled'))
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quotes (for quote requests)
CREATE POLICY "Anyone can submit quotes"
  ON quotes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read all quotes (for admin dashboard)
CREATE POLICY "Authenticated users can read quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update quotes (for admin management)
CREATE POLICY "Authenticated users can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);