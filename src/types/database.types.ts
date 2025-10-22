export interface Quote {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  custom_event_type: string | null;
  guest_count: string;
  event_date: string;
  start_time: string;
  end_time: string;
  event_location: string;
  distance_from_mckinney: number;
  water_connection: string;
  cleaning_attendant: boolean;
  baby_changing_station: boolean;
  additional_requests: string | null;
  quote_amount: number;
  status: 'pending' | 'contacted' | 'booked' | 'completed' | 'cancelled';
  admin_notes: string | null;
  admin_email_history: any;
  last_updated_by: string | null;
  deposit_amount: number;
  deposit_status: 'not_required' | 'pending' | 'partial' | 'paid';
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  payment_method: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags: string[];
  customer_notes: string | null;
  last_contacted_at: string | null;
  equipment_checklist: any;
  is_archived: boolean;
}

export interface QuoteHistory {
  id: string;
  quote_id: string;
  changed_by: string | null;
  changed_at: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  change_type: 'create' | 'update' | 'status_change' | 'note_added';
}

export interface CustomerCommunication {
  id: string;
  quote_id: string;
  sent_by: string | null;
  sent_at: string;
  communication_type: 'email' | 'sms' | 'phone' | 'note';
  subject: string | null;
  message: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata: any;
}

export interface EmailTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category: 'quote_received' | 'quote_follow_up' | 'booking_confirmed' | 'event_reminder' | 'thank_you' | 'custom';
  subject: string;
  body: string;
  variables: any;
  is_active: boolean;
}

export interface QuoteAttachment {
  id: string;
  quote_id: string;
  uploaded_by: string | null;
  uploaded_at: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  description: string | null;
}

export interface AdminUser {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login: string | null;
  user_id: string | null;
}

export interface QuoteStats {
  total: number;
  pending: number;
  contacted: number;
  booked: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  upcomingEvents: number;
  avgResponseTime: number;
  conversionRate: number;
  pendingFollowUps: number;
}

export interface QuoteFilters {
  status?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
  tags?: string[];
  paymentStatus?: string;
}
