
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch,
  },
});

// Add customSupabase as an alias to match existing imports
export const customSupabase = supabase;

// Define row types used in various components
export interface HeatCycleRow {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  intensity?: string | null;
  cycle_number?: number | null;
  symptoms?: string[] | null;
  fertility_indicators?: any | null;
  cycle_length?: number | null;
  recorded_by?: string | null;
}

export interface LicenseRow {
  id: string;
  license_type: string;
  license_number?: string;
  license_name?: string;
  description?: string;
  issued_date?: string;
  expiry_date: string;
  document_url?: string;
  breeder_id?: string;
  created_at: string;
  status?: string;
}

export interface InspectionRow {
  id: string;
  title: string;
  inspection_date: string;
  status: string;
  inspector?: string;
  notes?: string;
  follow_up?: string;
  next_date?: string;
  breeder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRequirementRow {
  id: string;
  title: string;
  category: string;
  description?: string;
  due_date: string;
  status: string;
  priority: string;
  breeder_id?: string;
  reminder_sent: boolean;
  completed_at?: string;
  created_at: string;
}

export interface CommunicationTemplatesRow {
  id: string;
  name: string;
  type: string;
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCommunicationsRow {
  id: string;
  customer_id: string;
  type: string;
  subject?: string;
  content: string;
  status: string;
  sent_at: string;
  created_at: string;
}

// Add a helper to check table existence - useful for development
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
    return false;
  }
};

// Add a function to handle common Supabase errors gracefully
export const handleSupabaseError = (error: any, defaultMessage: string = 'An error occurred'): string => {
  if (!error) return defaultMessage;
  
  // Handle specific Postgres/Supabase error codes
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        return 'This record already exists';
      case '23503': // Foreign key violation
        return 'This action references a record that doesn\'t exist';
      case '23502': // Not null violation
        return `Required field is missing: ${error.details?.replace('Key (', '').replace(')=', '')}`;
      case '42P01': // Undefined table
        return 'The requested data table doesn\'t exist';
      case 'PGRST116': // Row not found
        return 'Record not found';
      case '42501': // Insufficient privileges
        return 'You don\'t have permission to perform this action';
      default:
        console.error('Supabase error:', error);
        return error.message || defaultMessage;
    }
  }
  
  return error.message || defaultMessage;
};
