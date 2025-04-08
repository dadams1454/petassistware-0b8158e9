
/**
 * Re-export WeightRecord type from health module for backward compatibility
 */
import { WeightRecord as HealthModuleWeightRecord } from '@/modules/health/types';
import { WeightUnit } from './weight-units';

/**
 * Re-export WeightRecord type for backward compatibility
 */
export type WeightRecord = HealthModuleWeightRecord;

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
