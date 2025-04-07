
import { WeightUnit } from './weight-units';

export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  created_at: string;
  notes?: string;
  percent_change?: number;
  age_days?: number;
  birth_date?: string;
  unit?: WeightUnit; // For backward compatibility
}

export interface GrowthStats {
  currentWeight?: number;
  previousWeight?: number;
  percentChange?: number;
  weeklyGrowth?: number;
  averageGrowth?: number;
  projectedWeight?: number;
  weightUnit: WeightUnit;
}
