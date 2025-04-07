
import { WeightRecord as HealthModuleWeightRecord } from '@/modules/health/types';

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
    unit: string;
    date: string;
  };
}
