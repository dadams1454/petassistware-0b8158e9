
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Using environment variables to access Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Type definitions for our Supabase tables
export type CommunicationTemplatesRow = {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type CustomerCommunicationsRow = {
  id: string;
  customer_id: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  status: 'sent' | 'pending' | 'failed';
  sent_at: string;
  created_at: string;
  customers?: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
};

export type InspectionRow = {
  id: string;
  title: string;
  inspection_date: string;
  next_date?: string | null;
  inspector?: string;
  status: 'scheduled' | 'completed' | 'failed';
  follow_up?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  breeder_id?: string;
};

// Just use regular supabase for compliance functions - no need for customSupabase
export const customSupabase = supabase;
