import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      })
    } as any

export type Database = {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          event_type: string
          custom_event_type: string | null
          guest_count: string
          event_date: string
          start_time: string
          end_time: string
          event_location: string
          distance_from_mckinney: number
          water_connection: string
          cleaning_attendant: boolean
          baby_changing_station: boolean
          additional_requests: string | null
          quote_amount: number
          status: 'pending' | 'contacted' | 'booked' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          event_type: string
          custom_event_type?: string | null
          guest_count: string
          event_date: string
          start_time: string
          end_time: string
          event_location: string
          distance_from_mckinney: number
          water_connection: string
          cleaning_attendant?: boolean
          baby_changing_station?: boolean
          additional_requests?: string | null
          quote_amount: number
          status?: 'pending' | 'contacted' | 'booked' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          event_type?: string
          custom_event_type?: string | null
          guest_count?: string
          event_date?: string
          start_time?: string
          end_time?: string
          event_location?: string
          distance_from_mckinney?: number
          water_connection?: string
          cleaning_attendant?: boolean
          baby_changing_station?: boolean
          additional_requests?: string | null
          quote_amount?: number
          status?: 'pending' | 'contacted' | 'booked' | 'completed' | 'cancelled'
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          message: string
          status: 'new' | 'responded' | 'closed'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'new' | 'responded' | 'closed'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'new' | 'responded' | 'closed'
        }
      }
    }
  }
}