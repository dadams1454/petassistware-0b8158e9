
/**
 * Weight-related type definitions
 */
import { WeightUnit } from './weight-units';

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  created_at: string;
  percent_change?: number;
  age_days?: number;
  birth_date?: string;
  notes?: string;
}

// Growth statistics type
export interface GrowthStats {
  recentWeights: WeightRecord[];
  averageGrowth?: number;
  percentChange?: number;
  projectedWeight?: number;
  minWeight?: number;
  maxWeight?: number;
  totalGrowth?: number;
  weightGoal?: number;
  onTrack?: boolean;
}
