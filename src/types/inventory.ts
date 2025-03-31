
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  location: string;
  lastRestocked: string;
  notes?: string;
  supplier?: string;
  cost?: number;
  expiration_date?: string;
  created_at?: string;
  updated_at?: string;
}

export type InventoryCategory = 
  | 'Food & Nutrition'
  | 'Medical Supplies'
  | 'Cleaning & Bedding'
  | 'Equipment'
  | 'Office Supplies'
  | 'Other';

export interface InventoryTransaction {
  id: string;
  inventory_id: string;
  transaction_type: 'add' | 'remove' | 'adjust';
  quantity: number;
  transaction_date: string;
  performed_by: string;
  notes?: string;
  created_at?: string;
}
