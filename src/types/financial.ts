
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
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
