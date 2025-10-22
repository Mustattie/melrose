/*
  # Enhanced Admin Dashboard Schema

  ## Overview
  This migration adds comprehensive admin dashboard features including quote history tracking,
  email templates, customer communications, and file attachments.

  ## New Tables
  
  ### 1. `quote_history`
  Tracks all changes made to quotes for audit trail
  - `id` (uuid, primary key)
  - `quote_id` (uuid, references quotes)
  - `changed_by` (uuid, references auth.users)
  - `changed_at` (timestamptz)
  - `field_name` (text) - Name of field changed
  - `old_value` (text) - Previous value
  - `new_value` (text) - New value
  - `change_type` (text) - Type of change (create, update, status_change, note_added)
  
  ### 2. `email_templates`
  Stores reusable email templates for customer communications
  - `id` (uuid, primary key)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - `name` (text) - Template name
  - `category` (text) - Template category
  - `subject` (text) - Email subject line
  - `body` (text) - Email body content
  - `variables` (jsonb) - Available variables for template
  - `is_active` (boolean) - Whether template is active
  
  ### 3. `customer_communications`
  Tracks all communications with customers
  - `id` (uuid, primary key)
  - `quote_id` (uuid, references quotes)
  - `sent_by` (uuid, references auth.users)
  - `sent_at` (timestamptz)
  - `communication_type` (text) - email, sms, phone, note
  - `subject` (text) - Communication subject
  - `message` (text) - Communication message
  - `status` (text) - draft, sent, delivered, read, failed
  - `metadata` (jsonb) - Additional metadata
  
  ### 4. `quote_attachments`
  Stores file attachments related to quotes
  - `id` (uuid, primary key)
  - `quote_id` (uuid, references quotes)
  - `uploaded_by` (uuid, references auth.users)
  - `uploaded_at` (timestamptz)
  - `file_name` (text)
  - `file_url` (text)
  - `file_type` (text)
  - `file_size` (bigint)
  - `description` (text)

  ## Security
  All tables have RLS enabled with appropriate policies for authenticated admin users
*/

-- Create quote_history table
CREATE TABLE IF NOT EXISTS quote_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now(),
  field_name text NOT NULL,
  old_value text,
  new_value text,
  change_type text DEFAULT 'update' CHECK (change_type IN ('create', 'update', 'status_change', 'note_added'))
);

ALTER TABLE quote_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read quote history"
  ON quote_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert quote history"
  ON quote_history FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_quote_history_quote_id ON quote_history(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_history_changed_at ON quote_history(changed_at);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('quote_received', 'quote_follow_up', 'booking_confirmed', 'event_reminder', 'thank_you', 'custom')),
  subject text NOT NULL,
  body text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read email templates"
  ON email_templates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage email templates"
  ON email_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default email templates
INSERT INTO email_templates (name, category, subject, body, variables) VALUES
  ('Quote Received', 'quote_received', 'Thank you for your quote request', 
   'Hi {{name}},\n\nThank you for requesting a quote from Melrose Mobile Restrooms. We have received your request for {{event_type}} on {{event_date}}.\n\nWe will review your request and get back to you shortly with a detailed quote.\n\nBest regards,\nMelrose Mobile Restrooms', 
   '["name", "event_type", "event_date"]'::jsonb),
  ('Booking Confirmed', 'booking_confirmed', 'Your reservation is confirmed!', 
   'Hi {{name}},\n\nGreat news! Your reservation for {{event_type}} on {{event_date}} is confirmed.\n\nEvent Details:\n- Date: {{event_date}}\n- Time: {{start_time}} - {{end_time}}\n- Location: {{event_location}}\n- Total: ${{quote_amount}}\n\nWe look forward to serving you!\n\nBest regards,\nMelrose Mobile Restrooms', 
   '["name", "event_type", "event_date", "start_time", "end_time", "event_location", "quote_amount"]'::jsonb),
  ('Event Reminder', 'event_reminder', 'Reminder: Your event is coming up', 
   'Hi {{name}},\n\nThis is a friendly reminder that your event is coming up on {{event_date}}.\n\nWe will arrive at {{event_location}} to set up before your event starts at {{start_time}}.\n\nIf you have any questions or need to make changes, please contact us.\n\nBest regards,\nMelrose Mobile Restrooms', 
   '["name", "event_date", "event_location", "start_time"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Create customer_communications table
CREATE TABLE IF NOT EXISTS customer_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  sent_by uuid REFERENCES auth.users(id),
  sent_at timestamptz DEFAULT now(),
  communication_type text NOT NULL CHECK (communication_type IN ('email', 'sms', 'phone', 'note')),
  subject text,
  message text NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read communications"
  ON customer_communications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert communications"
  ON customer_communications FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_customer_communications_quote_id ON customer_communications(quote_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_sent_at ON customer_communications(sent_at);

-- Create quote_attachments table
CREATE TABLE IF NOT EXISTS quote_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id),
  uploaded_at timestamptz DEFAULT now(),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  description text
);

ALTER TABLE quote_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read attachments"
  ON quote_attachments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert attachments"
  ON quote_attachments FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_quote_attachments_quote_id ON quote_attachments(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_attachments_uploaded_at ON quote_attachments(uploaded_at);