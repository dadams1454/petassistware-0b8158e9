
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date | string;  // Allow both Date and string types
  category: string;
  receipt?: any;
  created_at: string;
  notes?: string;
  dog_id?: string;
  puppy_id?: string;
  breeder_id?: string;
  transaction_type: string;
  transaction_date: string;
  receipt_url?: string;
  payment_method?: string;
}

export interface ExpenseFormValues {
  description: string;
  amount: number;
  date: Date;
  category: string;
  receipt?: File | null;
  notes?: string;
  dog_id?: string;
  puppy_id?: string;
}

export interface ExpenseCategory {
  value: string;
  label: string;
}
