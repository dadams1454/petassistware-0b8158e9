
export interface FollowUpItem {
  id: string;
  type: 'waitlist' | 'customer' | 'puppy';
  customer_id: string;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
  due_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  reference_id: string;
  created_at: string;
}
