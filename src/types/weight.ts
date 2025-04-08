
/**
 * Weight-related type definitions
 */
import { WeightUnit } from './weight-units';

/**
 * Interface for weight record
 */
export interface WeightRecord {
  id: string;
  dog_id?: string;
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
 * Growth statistics interface
 */
export interface GrowthStats {
  percentChange: number;
  averageGrowthRate?: number;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  currentWeight?: {
    value: number;
    unit: WeightUnit;
    date: string;
  };
  totalGrowth?: number;
  lastWeekGrowth?: number;
  growthRate?: number;
}
