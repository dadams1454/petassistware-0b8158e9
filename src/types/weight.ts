
import { WeightUnit } from './common';

export interface WeightRecord {
  id: string;
  dog_id: string; // Must be required for the database
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
  unit?: WeightUnit; // For backward compatibility
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
  maxGrowthRate?: number;
  minGrowthRate?: number; // Adding this field referenced in the code
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
  onSuccess?: () => void; // Adding this prop which is used in some components
}

export interface WeightTrackerProps {
  dogId?: string;
  puppyId?: string;
  birthDate?: string;
  onWeightAdded?: () => void;
  isAddingWeight?: boolean; // Adding this prop referenced in the code
  onCancelAdd?: () => void; // Adding this prop referenced in the code
}

export interface WeightRecordsTableProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
  onEdit?: (record: WeightRecord) => void; // Adding this prop referenced in the code
}

export interface WeightEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId?: string;
  puppyId?: string;
  onSave: (data: Partial<WeightRecord>) => void;
  onCancel: () => void;
  onSuccess?: () => void; // Adding this prop referenced in the code
  initialData?: Partial<WeightRecord>; // Adding this prop referenced in the code
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

// Export the WeightUnit type for compatibility
export { WeightUnit };
