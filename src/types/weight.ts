
import { WeightUnit } from './common';

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
  created_at: string;
  age_days?: number; // For puppy weight tracking
}

export interface GrowthStats {
  currentWeight: number;
  weightUnit: string;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
}

export interface WeightTracking {
  weightHistory: WeightRecord[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  addWeightRecord: (data: Partial<WeightRecord>) => Promise<void>;
  updateWeightRecord: (id: string, data: Partial<WeightRecord>) => Promise<void>;
  deleteWeightRecord: (id: string) => Promise<void>;
  growthStats: GrowthStats;
  getLatestWeight: () => WeightRecord | null;
}
