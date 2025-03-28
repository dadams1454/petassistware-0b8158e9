
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fdgxiapgarvkvlcpqahv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3hpYXBnYXJ2a3ZsY3BxYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTk0ODAsImV4cCI6MjA1Njc3NTQ4MH0.3zcid-VfILgUnpiBTlNEQqV5MVt8g4Rf1NNP2ocRiBs";

// Add custom types for the tables that aren't yet in the Database type
export type CustomerCommunicationsRow = {
  id: string;
  customer_id: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  sent_at: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  customers?: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
};

export type CommunicationTemplatesRow = {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
