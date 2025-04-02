
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
