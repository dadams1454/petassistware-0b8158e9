
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fdgxiapgarvkvlcpqahv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3hpYXBnYXJ2a3ZsY3BxYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTk0ODAsImV4cCI6MjA1Njc3NTQ4MH0.3zcid-VfILgUnpiBTlNEQqV5MVt8g4Rf1NNP2ocRiBs";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
