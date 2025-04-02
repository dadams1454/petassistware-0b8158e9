import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL and key
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Create a supabase client with fallback values for development (these will be replaced by actual values at build time)
export const supabase = createClient(
  supabaseUrl || 'https://fdgxiapgarvkvlcpqahv.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3hpYXBnYXJ2a3ZsY3BxYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTk0ODAsImV4cCI6MjA1Njc3NTQ4MH0.3zcid-VfILgUnpiBTlNEQqV5MVt8g4Rf1NNP2ocRiBs'
);

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

// Additional row types needed by components
export interface CommunicationTemplatesRow {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LicenseRow {
  id: string;
  license_type: string;
  license_number?: string;
  issued_date?: string;
  expiry_date?: string;
  document_url?: string;
  breeder_id?: string;
  created_at: string;
}

export interface ComplianceRequirementRow {
  id: string;
  title: string;
  category: string;
  description?: string;
  due_date: string;
  status: string;
  priority: string;
  reminder_sent: boolean;
  completed_at?: string;
  breeder_id?: string;
  created_at: string;
}

export interface InspectionRow {
  id: string;
  title: string;
  inspection_date: string;
  status: 'scheduled' | 'passed' | 'failed';
  inspector?: string;
  notes?: string;
  follow_up?: string;
  next_date?: string;
  breeder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  event_date: string;
  event_type: string;
  description?: string;
  status: string;
  breeder_id: string;
  created_at: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
}
