
import { Json } from './supabase';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  metadata?: CustomerMetadata;
  tenant_id?: string;
  created_at?: string;
}

export interface CustomerMetadata {
  customer_type?: 'new' | 'returning';
  customer_since?: string;
  interested_puppy_id?: string;
  interested_litter_id?: string;
  waitlist_type?: 'specific' | 'open';
}

export interface CustomerWithMeta extends Customer {
  // CustomerWithMeta now inherits all properties from Customer
  // Including the properly typed metadata field
}
