
import { Customer } from '@/components/customers/types/customer';

export interface FollowUpItem {
  id: string;
  type: 'waitlist' | 'customer' | 'manual';
  customer_id: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  notes: string | null;
  reference_id?: string;
  created_at: string;
  customer: Customer;
}

