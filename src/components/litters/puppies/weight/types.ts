
export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string | null;
  date: string | Date;
  weight: number;
  weight_unit: string;
  notes?: string;
  percent_change?: number | null;
  created_at?: string;
}
