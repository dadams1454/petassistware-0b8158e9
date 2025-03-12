
import { Customer } from '../customers/types/customer';

export interface WaitlistEntry {
  id: string;
  customer_id: string;
  litter_id: string;
  requested_at: string;
  status: 'pending' | 'contacted' | 'approved' | 'declined';
  notes: string | null;
  preferences: {
    gender_preference?: 'Male' | 'Female' | null;
    color_preference?: string | null;
  };
  position: number | null;
  contacted_at: string | null;
  customers: Customer;
}

export interface WaitlistManagerProps {
  litterId: string;
  litterName: string;
}
