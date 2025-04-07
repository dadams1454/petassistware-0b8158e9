
import { WeightUnit } from './weight-units';

/**
 * Weight record interface
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
 * Statistics about growth based on weight records
 */
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange?: number;
  dailyGrowthAverage: number;
  weeklyGrowthAverage?: number;
  growthRate: number; 
  lastWeekGrowth: number;
  projectedWeight: number;
  onTrack?: boolean;
  weightGoal?: number;
}
