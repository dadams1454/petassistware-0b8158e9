export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
  birth_date?: string;
  age_days?: number;
  formatted_date?: string;
}

export interface WeightData {
  weights: WeightRecord[];
  isLoading: boolean;
  error: Error | null;
}

// Other health-related interfaces can be added here
