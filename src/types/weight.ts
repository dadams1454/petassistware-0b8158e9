
import type { WeightUnit } from './common';

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

// Growth stats definition
export interface GrowthStats {
  currentWeight?: number;
  weightUnit?: string;
  averageGrowthRate: number;
  maxGrowthRate: number;
  minGrowthRate: number;
  dailyGrowthAverage: number;
  weeklyGrowthAverage: number;
  lastWeight: number;
  firstWeight: number;
  totalGain: number;
  percentGain: number;
  projectedWeight?: number;
  weightGoal?: number | null;
  onTrack?: boolean | null;
  percentChange?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
  totalGrowth?: number | null;
}

// Helper function for calculating percent change
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number
): number => {
  if (oldWeight === 0) return 0; // Prevent division by zero
  const change = ((newWeight - oldWeight) / oldWeight) * 100;
  return Math.round(change * 10) / 10;
};

// Export WeightUnit for compatibility
export type { WeightUnit };
