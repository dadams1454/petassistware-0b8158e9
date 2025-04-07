
import { WeightUnit } from './weight-units';

/**
 * Represents a weight record in the system
 */
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  age_days?: number;
  birth_date?: string;
  created_at: string;
}

/**
 * Growth statistics calculated from weight records
 */
export interface GrowthStats {
  currentWeight: number | null;
  weightUnit: WeightUnit;
  averageGrowth: number;
  growthRate: number;
  totalGrowth: number | null;
  percentChange: number;
  lastWeekGrowth: number;
  projectedWeight: number | null;
  weightGoal: number | null;
  onTrack: boolean | null;
}
