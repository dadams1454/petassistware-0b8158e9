
import { WeightUnit } from './weight-units';

/**
 * Interface for weight record data
 */
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

/**
 * Growth statistics data
 */
export interface GrowthStats {
  currentWeight: number;
  averageGrowth: number;
  weightUnit: WeightUnit;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
}
