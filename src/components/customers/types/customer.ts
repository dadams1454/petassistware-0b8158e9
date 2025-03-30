
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  metadata?: any;
  created_at?: string;
}

export interface CustomerWithMeta extends Customer {
  created_at?: string;
}

export interface CustomerFormValues {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  type?: 'buyer' | 'breeder' | 'other';
  interested_breed?: string;
  interested_gender?: 'Male' | 'Female' | 'No Preference';
  interested_color?: string;
  waitlist?: boolean;
  litter_id?: string;
  customer_type?: string;
  customer_since?: string;
  interested_puppy_id?: string;
  interested_litter_id?: string;
  waitlist_type?: string;
}
