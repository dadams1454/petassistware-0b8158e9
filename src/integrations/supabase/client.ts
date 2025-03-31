
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

export type GeneticTestRow = {
  id: string;
  dog_id: string;
  test_type: string;
  test_date: string;
  result: string;
  lab_name: string;
  certificate_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  verified_by?: string;
};

export type GeneticCalculationRow = {
  id: string;
  dog_id: string;
  calculation_type: string;
  value: number;
  calculation_date: string;
};

export type GeneticAuditLogRow = {
  id: string;
  dog_id: string;
  user_id?: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
};

// Add types for our new compliance tables
export type InspectionRow = {
  id: string;
  title: string;
  inspector?: string;
  inspection_date: string;
  next_date?: string;
  status: 'scheduled' | 'passed' | 'failed';
  follow_up?: string;
  notes?: string;
  breeder_id?: string;
  created_at: string;
  updated_at: string;
};

export type ComplianceRequirementRow = {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'completed' | 'overdue' | 'due-soon' | 'pending';
  category: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  completed_at?: string;
  breeder_id?: string;
  reminder_sent: boolean;
};

export type LicenseRow = {
  id: string;
  license_type: string;
  license_number?: string;
  issued_date?: string;
  expiry_date?: string;
  document_url?: string;
  breeder_id?: string;
  created_at: string;
  notes?: string;
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Extend the Supabase client to work with custom tables not in the schema
// This is a type-safe way to work with tables until we update the Database type
export const customSupabase = {
  from: <T = any>(table: string) => ({
    select: (columns?: string) => supabase.from(table as any).select(columns),
    insert: (values: Partial<T> | Partial<T>[]) => supabase.from(table as any).insert(values),
    update: (values: Partial<T>) => supabase.from(table as any).update(values),
    delete: () => supabase.from(table as any).delete(),
    eq: (column: string, value: any) => ({
      select: (columns?: string) => supabase.from(table as any).select(columns).eq(column, value),
      delete: () => supabase.from(table as any).delete().eq(column, value),
      single: () => supabase.from(table as any).select('*').eq(column, value).single(),
      order: (column: string, options?: {ascending?: boolean}) => 
        supabase.from(table as any).select('*').eq(column, value).order(column, options)
    })
  })
};
