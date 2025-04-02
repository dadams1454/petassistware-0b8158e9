
import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Alias for backward compatibility
export const customSupabase = supabase;

// Define the CustomerCommunicationsRow type
export interface CustomerCommunicationsRow {
  id: string;
  customer_id: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  status: string;
  sent_at: string;
  created_at: string;
  customers?: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
}
