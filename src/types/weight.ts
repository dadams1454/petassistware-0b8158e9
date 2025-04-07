
import { WeightUnit } from './common';

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

export interface WeightStat {
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  change?: number;
  changePercent?: number;
}

export interface GrowthStats {
  percentChange?: number;
  averageGrowthRate?: number;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  lastWeightDate?: string;
  currentWeight?: number;
  weightUnit?: WeightUnit;
  totalGrowth?: number;
  averageGrowth?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
}

export interface WeightChartProps {
  weightHistory: WeightRecord[];
  dogId?: string;
  puppyId?: string;
  breed?: string;
}

export interface WeightEntryFormProps {
  dogId?: string;
  puppyId?: string;
  onSave: (data: WeightRecord) => void;
  onCancel: () => void;
  initialData?: Partial<WeightRecord>;
}

export interface WeightTrackerProps {
  dogId?: string;
  puppyId?: string;
  birthDate?: string;
  onWeightAdded?: () => void;
}

export interface WeightRecordsTableProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
}

export interface WeightEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId?: string;
  puppyId?: string;
  onSave: (data: Partial<WeightRecord>) => void;
  onCancel: () => void;
}

// Helper for calculating percent change
export function calculatePercentChange(oldWeight: number, newWeight: number): number {
  if (oldWeight === 0) return 0;
  const change = ((newWeight - oldWeight) / oldWeight) * 100;
  return Math.round(change * 10) / 10;
}

// For data visualization
export interface WeightDataPoint {
  date: string;
  weight: number;
  unit: WeightUnit;
  age?: number;
}

// Growth rate calculation type
export interface GrowthRate {
  daily: number;
  weekly: number;
  monthly: number;
  unit: WeightUnit;
}
