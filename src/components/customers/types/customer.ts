
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  notes?: string;
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
    interested_litter_id?: string;
    waitlist_type?: 'specific' | 'open';
  };
}
