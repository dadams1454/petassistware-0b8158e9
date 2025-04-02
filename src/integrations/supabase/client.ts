
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Define default values for development environment
// Using the project ID from supabase/config.toml
const PROJECT_ID = 'fdgxiapgarvkvlcpqahv';

// Using environment variables to access Supabase credentials with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${PROJECT_ID}.supabase.co`;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3hpYXBnYXJ2a3ZsY3BxYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTk0ODAsImV4cCI6MjA1Njc3NTQ4MH0.3zcid-VfILgUnpiBTlNEQqV5MVt8g4Rf1NNP2ocRiBs';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key available:', !!supabaseAnonKey);

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For backward compatibility
export const customSupabase = supabase;

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
  status: 'scheduled' | 'passed' | 'failed';
  follow_up?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  breeder_id?: string;
};

