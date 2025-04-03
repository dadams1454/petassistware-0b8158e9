
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
  birth_date?: string; // For age calculation
}

export interface GrowthStats {
  currentWeight: number;
  weightUnit: string;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
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
