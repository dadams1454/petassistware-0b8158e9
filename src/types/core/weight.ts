
/**
 * Core weight tracking type definitions
 * Unified type system for weight tracking across dogs and puppies
 */
import { BaseEntity } from './index';
import { WeightUnit } from '../weight-units';

// Unified weight record interface
export interface WeightRecord extends BaseEntity {
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  age_days?: number;
  birth_date?: string;
}

// Growth statistics interface
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

// Weight conversion options
export interface WeightConversionOptions {
  from: WeightUnit;
  to: WeightUnit;
  value: number;
  precision?: number;
}
