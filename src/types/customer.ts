
import { Json } from '@/types/supabase';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  metadata?: Json;
  tenant_id?: string;
  created_at?: string;
}

export interface CustomerWithMeta extends Customer {
  // Making address optional already handled in the base Customer interface
  metadata?: Json;
}
