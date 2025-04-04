
import { WeightUnit } from './common';

// Weight record interface
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

// Growth rate calculation interface
export interface GrowthRate {
  current: number;
  previous: number;
  change: number;
  percentChange: number;
}

// Weight data point for charts
export interface WeightDataPoint {
  date: string;
  weight: number;
  age?: number;
}

// Add GrowthStats definition that was missing
export interface GrowthStats {
  averageGrowthRate: number;
  maxGrowthRate: number;
  minGrowthRate: number;
  dailyGrowthAverage: number;
  weeklyGrowthAverage: number;
  lastWeight: number;
  firstWeight: number;
  totalGain: number;
  percentGain: number;
}
