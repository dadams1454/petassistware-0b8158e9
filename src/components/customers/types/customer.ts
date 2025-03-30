
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface CustomerWithMeta extends Customer {
  metadata?: Record<string, any>;
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
}
