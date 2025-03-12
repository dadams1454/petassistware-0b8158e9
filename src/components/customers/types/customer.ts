
import { Tables } from '@/integrations/supabase/types';

export type Customer = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
    interested_litter_id?: string;
    waitlist_type?: 'specific' | 'open';
  }
};

export type Puppy = Tables<'puppies'>;
