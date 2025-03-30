
export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  date: string;
  weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  notes?: string;
  percent_change?: number | null;
  created_at: string;
}

export interface WeightFormData {
  date: Date;
  weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  notes?: string;
}

export interface WeightTrackerProps {
  puppyId: string;
  onAddSuccess?: () => void;
}
