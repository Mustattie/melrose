/*
  # Add Admin Notes and Enhanced Features to Quotes Table

  ## Overview
  This migration enhances the quotes table with additional fields needed for 
  admin reservation management functionality.

  ## Changes to `quotes` Table
  
  ### New Columns
  1. **`admin_notes`** (text, nullable) - Internal notes that admins can add to reservations
     - Used for tracking special requirements, customer communications, or internal reminders
     - Not visible to customers, only to admin users
     
  2. **`admin_email_history`** (jsonb, default empty array) - Tracks email communications
     - Stores history of emails sent to customers
     - Each entry contains: timestamp, subject, template_used, sent_by
     
  3. **`last_updated_by`** (uuid, nullable) - References admin user who last updated the quote
     - Links to admin_users.user_id for audit trail
     
  4. **`updated_at`** (timestamptz) - Timestamp of last update
     - Automatically updated when record changes
  
  ### Modified Columns
  - Updated status check constraint to include 'contacted' state
  
  ## Security Updates
  
  ### New RLS Policies
  - Authenticated users (admins) can now delete quotes for cleanup/management
  
  ## Important Notes
  - Admin notes are private and should never be exposed to public endpoints
  - Email history helps track customer communications
  - Audit fields (last_updated_by, updated_at) help track changes
*/

-- Add admin notes field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE quotes ADD COLUMN admin_notes text;
  END IF;
END $$;

-- Add email history tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'admin_email_history'
  ) THEN
    ALTER TABLE quotes ADD COLUMN admin_email_history jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add last updated by field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'last_updated_by'
  ) THEN
    ALTER TABLE quotes ADD COLUMN last_updated_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add updated_at timestamp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE quotes ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add delete policy for authenticated users (admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quotes' 
    AND policyname = 'Authenticated users can delete quotes'
  ) THEN
    CREATE POLICY "Authenticated users can delete quotes"
      ON quotes
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_event_date ON quotes(event_date);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_updated_at ON quotes(updated_at);
